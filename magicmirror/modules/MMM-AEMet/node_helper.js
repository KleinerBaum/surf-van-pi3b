const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
  start() {},

  socketNotificationReceived(notification, payload) {
    if (notification === "GET_FORECAST") {
      const { apiKey, lat, lon } = payload;
      const headers = { accept: "application/json", api_key: apiKey };
      fetch(`https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/latlon/${lat},${lon}`, { headers })
        .then(res => res.json())
        .then(json => fetch(json.datos).then(r2 => r2.json()))
        .then(data => {
          const fc = data[0];
          const day = fc.prediccion.dia[0];
          const result = {
            location: fc.nombre,
            state: day.estadoCielo[0].descripcion,
            temp_min: day.temperatura.minima,
            temp_max: day.temperatura.maxima,
            precip: day.probPrecipitacion[0].value,
            wind: day.viento[0].velocidad
          };
          this.sendSocketNotification("AEMET_RESULT", result);
        })
        .catch(() => {
          this.sendSocketNotification("AEMET_RESULT", null);
        });
    }
  }
});
