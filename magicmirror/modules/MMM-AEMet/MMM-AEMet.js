Module.register("MMM-AEMet", {
  defaults: {
    apiKey: "",
    lat: 36.721,
    lon: -4.421,
    updateInterval: 6 * 60 * 60 * 1000,
  },

  start() {
    this.forecast = null;
    this.getData();
    setInterval(() => this.getData(), this.config.updateInterval);
  },

  getStyles() {
    return ["MMM-AEMet.css"];
  },

  getData() {
    this.sendSocketNotification("GET_FORECAST", {
      apiKey: this.config.apiKey,
      lat: this.config.lat,
      lon: this.config.lon,
    });
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "AEMET_RESULT") {
      this.forecast = payload;
      this.updateDom();
    }
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "aemet-wrapper";
    if (!this.forecast) {
      wrapper.innerHTML = "Lade AEMet ...";
      return wrapper;
    }
    wrapper.innerHTML = `
      <div><b>${this.forecast.location}</b></div>
      <div>Zustand: ${this.forecast.state}</div>
      <div>Temp: ${this.forecast.temp_min}&deg;C – ${this.forecast.temp_max}&deg;C</div>
      <div>Regen: ${this.forecast.precip}%</div>
      <div>Wind: ${this.forecast.wind} km/h</div>
    `;
    return wrapper;
  },
});
