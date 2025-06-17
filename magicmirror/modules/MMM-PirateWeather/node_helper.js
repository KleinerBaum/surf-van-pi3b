const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
  start() {},

  socketNotificationReceived(notification, payload) {
    if (notification === "GET_PIRATE") {
      const { apiKey, lat, lon } = payload;
      fetch(`https://api.pirateweather.net/forecast/${apiKey}/${lat},${lon}?units=auto&lang=de`)
        .then(res => res.json())
        .then(data => {
          const curr = data.currently;
          const result = {
            summary: curr.summary,
            temperature: curr.temperature,
            windSpeed: curr.windSpeed,
            humidity: curr.humidity,
            pressure: curr.pressure,
            precipProbability: curr.precipProbability,
            cloudCover: curr.cloudCover
          };
          this.sendSocketNotification("PIRATE_RESULT", result);
        })
        .catch(() => {
          this.sendSocketNotification("PIRATE_RESULT", null);
        });
    }
  }
});
