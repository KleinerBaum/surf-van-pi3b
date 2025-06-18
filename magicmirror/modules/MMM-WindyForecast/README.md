# MMM-WindyForecast

Zeigt Windy.com-Karte, Webcams und Forecast-Daten auf dem MagicMirror².

## Installation

1. Ordner `MMM-WindyForecast` ins `modules/`-Verzeichnis kopieren.
2. Im Modulordner `npm install node-fetch@2` ausführen.
3. API-Keys für Windy (Point Forecast und Webcams) besorgen und in der
   `config.js` eintragen.

## Konfiguration
```js
{
  module: "MMM-WindyForecast",
  position: "top_center",
  config: {
    lat: 36.721,
    lon: -4.421,
    overlay: "wind",
    pointKey: "<DEIN_POINT_KEY>",
    webcamKey: "<DEIN_WEBCAM_KEY>",
  }
}
```
