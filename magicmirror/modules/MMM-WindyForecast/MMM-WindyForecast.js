Module.register("MMM-WindyForecast", {
  defaults: {
    lat: 36.721,
    lon: -4.421,
    zoom: 10,
    overlay: "wind",
    mapKey: "",
    webcamKey: "",
    pointKey: "",
    model: "gfs",
    radius_km: 25,
  },

  getStyles() {
    return ["MMM-WindyForecast.css"];
  },

  start() {
    this.forecast = null;
    this.webcams = [];
    this.loaded = false;
    this.getData();
    setInterval(() => this.getData(), 60 * 60 * 1000);
  },

  getData() {
    this.sendSocketNotification("GET_DATA", {
      lat: this.config.lat,
      lon: this.config.lon,
      pointKey: this.config.pointKey,
      webcamKey: this.config.webcamKey,
      model: this.config.model,
      radius: this.config.radius_km,
    });
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "DATA_RESULT") {
      this.forecast = payload.forecast;
      this.webcams = payload.webcams;
      this.loaded = true;
      this.updateDom();
    }
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "windy-forecast-wrapper";

    const map = document.createElement("iframe");
    map.className = "windy-map";
    map.src =
      `https://embed.windy.com/embed2.html?lat=${this.config.lat}` +
      `&lon=${this.config.lon}&zoom=${this.config.zoom}` +
      `&level=surface&overlay=${this.config.overlay}&menu=&message=true&marker=true`;
    map.width = "100%";
    map.height = "340";
    map.frameBorder = "0";
    wrapper.appendChild(map);

    if (this.webcams.length) {
      const camBar = document.createElement("div");
      camBar.className = "windy-webcams-bar";
      this.webcams.slice(0, 3).forEach((cam) => {
        const camDiv = document.createElement("div");
        camDiv.className = "webcam";
        camDiv.innerHTML = `
          <img src="${cam.image.current.preview}" alt="${cam.title || cam.location.city}" style="width:100px;border-radius:8px;">
          <br>
          <small>${cam.title || cam.location.city}</small>
        `;
        camBar.appendChild(camDiv);
      });
      wrapper.appendChild(camBar);
    }

    if (this.forecast && this.forecast.intervals) {
      const params = [
        ["wind", "Wind"],
        ["windGust", "B\u00f6en"],
        ["temp", "Temp"],
        ["dewpoint", "Taupunkt"],
        ["precip", "Niederschlag"],
        ["ptype", "Regen-Art"],
        ["cape", "CAPE"],
        ["clouds", "Wolken (hoch)"],
        ["clouds_medium", "Wolken (mittel)"],
        ["clouds_low", "Wolken (tief)"],
        ["rh", "Luftfeuchte"],
        ["gh", "Geopotential"],
        ["pressure", "Druck"],
        ["waves", "Wellen"],
        ["windWaves", "Windwelle"],
        ["swell1", "Swell1"],
        ["swell2", "Swell2"],
        ["co", "CO"],
        ["dust", "Staub"],
        ["so2", "SO2"],
      ];
      const interval = this.forecast.intervals[0];
      const grid = document.createElement("div");
      grid.className = "windy-param-grid";
      params.forEach(([key, label]) => {
        const cell = document.createElement("div");
        cell.className = "param-cell";
        cell.innerHTML = `<b>${label}</b><br>${interval.values[key] !== undefined ? interval.values[key] : "-"}`;
        grid.appendChild(cell);
      });
      wrapper.appendChild(grid);
    } else if (!this.loaded) {
      wrapper.innerHTML += "<div>Lade Wetterdaten ...</div>";
    }

    const pluginDiv = document.createElement("div");
    pluginDiv.className = "windy-plugins";
    pluginDiv.innerHTML = `
      <iframe src="https://www.windy.com/plugins" style="width:100%;height:170px;border:none;border-radius:12px"></iframe>
      <div style="text-align:center;color:#aaa;font-size:0.85em;">Windy.com Plugin-Bereich</div>
    `;
    wrapper.appendChild(pluginDiv);

    return wrapper;
  },
});
