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
        apiKey: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnZXJyaXQuZmFiaXNjaDIwMjRAZ21haWwuY29tIiwianRpIjoiZTlhMWE0ZDktMWJlMC00NTkwLTlkODgtNDYxMzY1ZThkN2IwIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE3NTAxOTI5MDgsInVzZXJJZCI6ImU5YTFhNGQ5LTFiZTAtNDU5MC05ZDg4LTQ2MTM2NWU4ZDdiMCIsInJvbGUiOiIifQ.9fIBYzJoFXKlLWe0UUOVmW0Usym1cvEVEXHPRbeUnQI",
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
        pointKey: "<jmbOoi5E6wcbBopBC2SSctlrFg4kRQ3l>",
        webcamKey: "bqP18j779vqftLdj98RzHKMsbdABP2f7"
      }
    }
    // Füge max. 1-2 weitere leichte Module hinzu!
  ]
};
if (typeof module !== "undefined") {module.exports = config;}
