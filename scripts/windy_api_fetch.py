"""Fetch forecast data, webcams and map URL from Windy API."""

from __future__ import annotations

import os
import requests
from dotenv import load_dotenv

load_dotenv()

POINT_API_KEY = os.getenv("WINDY_POINT_KEY", "")
MAP_API_KEY = os.getenv("WINDY_MAP_KEY", "")
WEBCAM_API_KEY = os.getenv("WINDY_WEBCAM_KEY", "")


def fetch_point_forecast(lat: float, lon: float, model: str = "gfs") -> dict:
    """Return point forecast information from Windy."""
    url = "https://api.windy.com/api/point-forecast/v2"
    headers = {"Authorization": POINT_API_KEY}
    params = {
        "lat": lat,
        "lon": lon,
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
    """Return an embeddable map URL for Windy."""
    return (
        "https://embed.windy.com/embed2.html?"
        f"lat={lat}&lon={lon}&zoom={zoom}&level=surface&overlay={overlay}&menu=&message=true"
    )


def fetch_webcams(lat: float, lon: float, radius_km: int = 25) -> dict:
    """Return webcams near the location."""
    url = (
        "https://api.windy.com/api/webcams/v2/list/nearby="
        f"{lat},{lon},{radius_km}?show=webcams:player,image,location"
    )
    headers = {"x-windy-key": WEBCAM_API_KEY}
    resp = requests.get(url, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.json()


def main() -> None:
    """Example run printing info for Malaga."""
    lat, lon = 36.721, -4.421
    print("Forecast:")
    print(fetch_point_forecast(lat, lon))
    print("Map URL:")
    print(get_map_embed_url(lat, lon))
    print("Webcams:")
    print(fetch_webcams(lat, lon))


if __name__ == "__main__":
    main()
