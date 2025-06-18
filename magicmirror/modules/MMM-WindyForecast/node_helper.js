const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
  start() {},

  socketNotificationReceived(notification, payload) {
    if (notification === "GET_DATA") {
      const { lat, lon, pointKey, webcamKey, model, radius } = payload;
      const responses = {};
      fetch(
        `https://api.windy.com/api/point-forecast/v2?lat=${lat}&lon=${lon}&model=${model}&parameters=wind,windGust,temp,dewpoint,precip,ptype,cape,clouds,clouds_medium,clouds_low,rh,gh,pressure,waves,windWaves,swell1,swell2,co,dust,so2&levels=surface&key=${pointKey}`,
        {
          headers: { Authorization: pointKey }
        }
      )
        .then((res) => res.json())
        .then((forecast) => {
          responses.forecast = forecast;
          return fetch(
            `https://api.windy.com/api/webcams/v2/list/nearby=${lat},${lon},${radius}?show=webcams:player,image,location`,
            { headers: { "x-windy-key": webcamKey } }
          );
        })
        .then((res) => res.json())
        .then((webcams) => {
          responses.webcams = webcams.result && webcams.result.webcams ? webcams.result.webcams : [];
          this.sendSocketNotification("DATA_RESULT", responses);
        })
        .catch(() => {
          this.sendSocketNotification("DATA_RESULT", { forecast: null, webcams: [] });
        });
    }
  }
});
