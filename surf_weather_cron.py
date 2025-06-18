import os
import json
import subprocess
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

SURF_API_KEY = os.getenv("SURF_API_KEY")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
AEMET_API_KEY = os.getenv("AEMET_API_KEY", "")
PIRATEWEATHER_API_KEY = os.getenv("PIRATEWEATHER_API_KEY", "")
LAT = os.getenv("LAT", "36.721")
LON = os.getenv("LON", "-4.421")
OUTPUT_PATH = os.path.expanduser("~/MagicMirror/modules/MMM-Surf/data.json")
TMP_OUTPUT_PATH = "/tmp/MMM-Surf_data.json"


def fetch_surf_data() -> dict:
    url = "https://api.surfline.com/v1/forecasts?spotId=5842041f4e65fad6a77088b1&days=1"
    headers = {"Authorization": f"Bearer {SURF_API_KEY}"}
    resp = requests.get(url, headers=headers, timeout=30)
    if resp.status_code == 200:
        return resp.json()
    return {}


def fetch_weather_data() -> dict:
    url = f"https://www.worldtides.info/api?heights&extremes&lat=36.721&lon=-4.421&key={WEATHER_API_KEY}"
    resp = requests.get(url, timeout=30)
    if resp.status_code == 200:
        return resp.json()
    return {}


def fetch_aemet() -> dict | None:
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


def main() -> None:
    weather = fetch_aemet() or fetch_pirate() or {}
    data = {
        "updated": datetime.now().isoformat(),
        "surf": fetch_surf_data(),
        "weather": fetch_weather_data(),
        "forecast": weather,
    }
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(TMP_OUTPUT_PATH, "w") as f:
        json.dump(data, f)
    subprocess.run(["rsync", "-a", TMP_OUTPUT_PATH, OUTPUT_PATH], check=False)
    print(f"Updated surf/weather at {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
