Module.register("MMM-PirateWeather", {
  defaults: {
    apiKey: "",
    lat: 36.721,
    lon: -4.421,
    updateInterval: 6 * 60 * 60 * 1000,
  },

  start() {
    this.data = null;
    this.getData();
    setInterval(() => this.getData(), this.config.updateInterval);
  },

  getStyles() {
    return ["MMM-PirateWeather.css"];
  },

  getData() {
    this.sendSocketNotification("GET_PIRATE", {
      apiKey: this.config.apiKey,
      lat: this.config.lat,
      lon: this.config.lon,
    });
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "PIRATE_RESULT") {
      this.data = payload;
      this.updateDom();
    }
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "pirateweather-wrapper";
    if (!this.data) {
      wrapper.innerHTML = "Lade Pirate Weather ...";
      return wrapper;
    }
    wrapper.innerHTML = `
      <div><b>${this.data.summary}</b></div>
      <div>Temp: ${this.data.temperature}&deg;C</div>
      <div>Wind: ${this.data.windSpeed} m/s</div>
      <div>Feuchte: ${Math.round(this.data.humidity * 100)}%</div>
      <div>Druck: ${this.data.pressure} hPa</div>
      <div>Niederschl.: ${Math.round(this.data.precipProbability * 100)}%</div>
      <div>Wolken: ${Math.round(this.data.cloudCover * 100)}%</div>
    `;
    return wrapper;
  },
});
