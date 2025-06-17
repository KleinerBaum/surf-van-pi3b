"""Fetch forecast data from AEMet and store as JSON."""

from __future__ import annotations

import json
import os
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv()

AEMET_API_KEY = os.getenv("AEMET_API_KEY", "")
LAT = os.getenv("LAT", "36.721")
LON = os.getenv("LON", "-4.421")
OUTFILE = Path("aemet_weather.json")


def get_aemet_forecast(lat: str, lon: str, api_key: str) -> dict:
    """Return the forecast dictionary from AEMet."""
    headers = {"accept": "application/json", "api_key": api_key}
    url = (
        "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/latlon/"
        f"{lat},{lon}"
    )
    r = requests.get(url, headers=headers, timeout=30)
    r.raise_for_status()
    data_url = r.json()["datos"]
    data = requests.get(data_url, timeout=30).json()
    day = data[0]["prediccion"]["dia"][0]
    forecast = {
        "location": data[0]["nombre"],
        "state": day["estadoCielo"][0]["descripcion"],
        "temp_min": day["temperatura"]["minima"],
        "temp_max": day["temperatura"]["maxima"],
        "precip": day["probPrecipitacion"][0]["value"],
        "wind": day["viento"][0]["velocidad"],
    }
    return forecast


def main() -> None:
    """Write AEMet forecast to ``OUTFILE``."""
    result = get_aemet_forecast(LAT, LON, AEMET_API_KEY)
    OUTFILE.write_text(json.dumps(result, indent=2, ensure_ascii=False))
    print(f"[AEMet] Forecast written to {OUTFILE}")


if __name__ == "__main__":
    main()
