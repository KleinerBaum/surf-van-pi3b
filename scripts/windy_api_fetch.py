"""Fetch Windy forecast, map URL, and nearby webcams."""

from __future__ import annotations

import os
import requests
from dotenv import load_dotenv

load_dotenv()

POINT_API_KEY = os.getenv("WINDY_POINT_KEY", "")
MAP_API_KEY = os.getenv("WINDY_MAP_KEY", "")
WEBCAM_API_KEY = os.getenv("WINDY_WEBCAM_KEY", "")


def fetch_point_forecast(lat: float, lon: float, model: str = "gfs") -> dict:
    """Return point forecast as a dictionary."""
    url = "https://api.windy.com/api/point-forecast/v2"
    headers = {"Authorization": POINT_API_KEY}
    params: dict[str, str] = {
        "lat": str(lat),
        "lon": str(lon),
        "model": model,
        "parameters": ",".join(
            [
                "wind",
                "windGust",
                "temp",
                "dewpoint",
                "precip",
                "ptype",
                "cape",
                "clouds",
                "clouds_medium",
                "clouds_low",
                "rh",
                "gh",
                "pressure",
                "waves",
                "windWaves",
                "swell1",
                "swell2",
                "co",
                "dust",
                "so2",
            ]
        ),
        "levels": "surface",
        "key": POINT_API_KEY,
    }
    resp = requests.get(url, headers=headers, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


def get_map_embed_url(
    lat: float, lon: float, zoom: int = 10, overlay: str = "wind"
) -> str:
    """Return a public embed URL for a Windy map."""
    return (
        "https://embed.windy.com/embed2.html?lat="
        f"{lat}&lon={lon}&zoom={zoom}&level=surface&overlay={overlay}&menu=&message=true"
    )


def fetch_webcams(lat: float, lon: float, radius_km: int = 25) -> dict:
    """Return a JSON dictionary of nearby webcams."""
    url = (
        "https://api.windy.com/api/webcams/v2/list/nearby="
        f"{lat},{lon},{radius_km}?show=webcams:player,image,location"
    )
    headers = {"x-windy-key": WEBCAM_API_KEY}
    resp = requests.get(url, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.json()


if __name__ == "__main__":
    LAT, LON = 36.721, -4.421  # Example: Malaga
    print("Forecast:")
    print(fetch_point_forecast(LAT, LON))
    print("Map embed URL:")
    print(get_map_embed_url(LAT, LON, overlay="wind"))
    print("Webcams:")
    print(fetch_webcams(LAT, LON))
