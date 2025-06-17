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
    }
    // Füge max. 1-2 weitere leichte Module hinzu!
  ]
};
if (typeof module !== "undefined") {module.exports = config;}
