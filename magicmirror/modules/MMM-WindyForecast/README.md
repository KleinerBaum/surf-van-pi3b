# MMM-WindyForecast

Lightweight MagicMirror² module displaying Windy.com forecast, webcams and map.

## Installation

```bash
npm install node-fetch@2
```

## Configuration

```js
{
  module: "MMM-WindyForecast",
  position: "top_center",
  config: {
    lat: 36.721,
    lon: -4.421,
    zoom: 10,
    overlay: "wind",
    pointKey: "<DEIN_POINT_KEY>",
    webcamKey: "<DEIN_WEBCAM_KEY>",
    model: "gfs",
    radius_km: 25
  }
}
```
