import os
import json
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

SURF_API_KEY = os.getenv("SURF_API_KEY")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
OUTPUT_PATH = os.path.expanduser("~/MagicMirror/modules/MMM-Surf/data.json")

def fetch_surf_data():
    url = "https://api.surfline.com/v1/forecasts?spotId=5842041f4e65fad6a77088b1&days=1"
    headers = {"Authorization": f"Bearer {SURF_API_KEY}"}
    resp = requests.get(url, headers=headers)
    return resp.json() if resp.status_code == 200 else {}

def fetch_weather_data():
    url = f"https://www.worldtides.info/api?heights&extremes&lat=36.721&lon=-4.421&key={WEATHER_API_KEY}"
    resp = requests.get(url)
    return resp.json() if resp.status_code == 200 else {}

def main():
    data = {
        "updated": datetime.now().isoformat(),
        "surf": fetch_surf_data(),
        "weather": fetch_weather_data(),
    }
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(data, f)
    print(f"Updated surf/weather at {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
