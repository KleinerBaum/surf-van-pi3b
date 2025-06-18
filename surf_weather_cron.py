"""Combine surf, tide and weather data for MagicMirror."""

from __future__ import annotations

import json
import os
from datetime import datetime
from pathlib import Path
import subprocess

import requests
from dotenv import load_dotenv

load_dotenv()

SURF_API_KEY = os.getenv("SURF_API_KEY")
STORMGLASS_API_KEY = os.getenv("STORMGLASS_API_KEY")
AEMET_API_KEY = os.getenv("AEMET_API_KEY", "")
PIRATEWEATHER_API_KEY = os.getenv("PIRATEWEATHER_API_KEY", "")
LAT = os.getenv("LAT", "36.721")
LON = os.getenv("LON", "-4.421")
OUTPUT_PATH = Path(os.path.expanduser("~/MagicMirror/modules/MMM-Surf/data.json"))
CACHE_DIR = Path("/tmp/surfvan_cache")


def fetch_surf_data() -> dict:
    """Return surf forecast from Surfline."""
    url = "https://api.surfline.com/v1/forecasts?spotId=5842041f4e65fad6a77088b1&days=1"
    headers = {"Authorization": f"Bearer {SURF_API_KEY}"}
    resp = requests.get(url, headers=headers, timeout=30)
    if resp.status_code == 200:
        return resp.json()
    return {}


def fetch_tide_data() -> dict:
    """Return tide data from Stormglass."""
    url = f"https://api.stormglass.io/v2/tide/extremes/point?lat={LAT}&lng={LON}"
    headers = {"Authorization": STORMGLASS_API_KEY}
    resp = requests.get(url, headers=headers, timeout=30)
    if resp.status_code == 200:
        return resp.json()
    return {}


def fetch_aemet() -> dict | None:
    """Return AEMet forecast or ``None`` on error."""
    headers = {"accept": "application/json", "api_key": AEMET_API_KEY}
    url = f"https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/latlon/{LAT},{LON}"
    try:
        r = requests.get(url, headers=headers, timeout=30)
        r.raise_for_status()
        data_url = r.json()["datos"]
        data = requests.get(data_url, timeout=30).json()[0]
        day = data["prediccion"]["dia"][0]
        return {
            "location": data["nombre"],
            "state": day["estadoCielo"][0]["descripcion"],
            "temp_min": day["temperatura"]["minima"],
            "temp_max": day["temperatura"]["maxima"],
            "precip": day["probPrecipitacion"][0]["value"],
            "wind": day["viento"][0]["velocidad"],
        }
    except requests.RequestException:
        return None


def fetch_pirate() -> dict | None:
    """Return Pirate Weather data or ``None`` on error."""
    url = f"https://api.pirateweather.net/forecast/{PIRATEWEATHER_API_KEY}/{LAT},{LON}?units=auto&lang=de"
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        data = r.json()["currently"]
        return {
            "summary": data["summary"],
            "temperature": data["temperature"],
            "windSpeed": data["windSpeed"],
            "humidity": data["humidity"],
            "pressure": data["pressure"],
            "precipProbability": data["precipProbability"],
            "cloudCover": data["cloudCover"],
        }
    except requests.RequestException:
        return None


def write_atomic(data: dict, target: Path) -> None:
    """Write ``data`` to ``target`` using a tmpfs cache."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    temp = CACHE_DIR / "data.json"
    temp.write_text(json.dumps(data))
    target.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["rsync", "-a", str(temp), str(target)], check=True)


def main() -> None:
    """Gather data and write combined JSON."""
    weather = fetch_aemet() or fetch_pirate() or {}
    data = {
        "updated": datetime.now().isoformat(),
        "surf": fetch_surf_data(),
        "tides": fetch_tide_data(),
        "forecast": weather,
    }
    write_atomic(data, OUTPUT_PATH)
    print(f"Updated surf/weather at {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
