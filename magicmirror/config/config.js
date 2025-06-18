let config = {
  address: "0.0.0.0",
  port: 8080,
  language: "de",
  timeFormat: 24,
  units: "metric",
  modules: [
    { module: "clock", position: "top_left" },
    {
      module: "MMM-Surf",
      position: "top_right",
      config: {
        dataFile: "modules/MMM-Surf/data.json",
        showWaveHeight: true,
        showTide: true,
        showWind: false,    // weniger Grafik = weniger RAM
        locale: "es",
      }
    },
    {
      module: "MMM-AEMet",
      position: "top_left",
      config: {
        apiKey: "<DEIN_AEMET_KEY>",
        lat: 36.721,
        lon: -4.421
      }
    },
    {
      module: "MMM-PirateWeather",
      position: "top_right",
      config: {
        apiKey: "<DEIN_PIRATE_KEY>",
        lat: 36.721,
        lon: -4.421
      }
    },
    {
      module: "MMM-WindyForecast",
      position: "top_center",
      config: {
        lat: 36.721,
        lon: -4.421,
        overlay: "wind",
        pointKey: "<DEIN_POINT_KEY>",
        webcamKey: "<DEIN_WEBCAM_KEY>"
      }
    }
    // Füge max. 1-2 weitere leichte Module hinzu!
  ]
};
if (typeof module !== "undefined") {module.exports = config;}
