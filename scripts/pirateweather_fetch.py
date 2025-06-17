"""Fetch weather from Pirate Weather API and store as JSON."""

from __future__ import annotations

import json
import os
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv()

PIRATE_API_KEY = os.getenv("PIRATEWEATHER_API_KEY", "")
LAT = os.getenv("LAT", "36.721")
LON = os.getenv("LON", "-4.421")
OUTFILE = Path("pirate_weather.json")


def get_pirate_forecast(lat: str, lon: str, api_key: str) -> dict:
    """Return the current weather from Pirate Weather."""
    url = f"https://api.pirateweather.net/forecast/{api_key}/{lat},{lon}?units=auto&lang=de"
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    data = r.json()["currently"]
    forecast = {
        "summary": data["summary"],
        "temperature": data["temperature"],
        "windSpeed": data["windSpeed"],
        "humidity": data["humidity"],
        "pressure": data["pressure"],
        "precipProbability": data["precipProbability"],
        "cloudCover": data["cloudCover"],
    }
    return forecast


def main() -> None:
    """Write Pirate Weather forecast to ``OUTFILE``."""
    result = get_pirate_forecast(LAT, LON, PIRATE_API_KEY)
    OUTFILE.write_text(json.dumps(result, indent=2, ensure_ascii=False))
    print(f"[Pirate Weather] Forecast written to {OUTFILE}")


if __name__ == "__main__":
    main()
