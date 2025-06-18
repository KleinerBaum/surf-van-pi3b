/* MagicMirror Config – Surf Van Dashboard (Pi-3B+) */
require("dotenv").config();          //  .env → process.env

const { WINDY_POINT_KEY, WINDY_MAP_KEY, WINDY_WEBCAM_KEY,
        AEMET_API_KEY, LAT = 36.721, LON = -4.421 } = process.env;

var config = {
  address: "0.0.0.0",
  port: 8080,
  basePath: "/",
  language: "de",             // Toggle später über Modul possible
  timeFormat: 24,
  units: "metric",

  modules: [
    /* ─── Header ─────────────────────────────────────────── */
    { module: "clock",    position: "top_left"  },
    { module: "calendar", position: "top_right",
      config: { maximumEntries: 6 } },

    /* ─── Windy Forecast Map + Webcams ───────────────────── */
    { module: "MMM-WindyForecast",
      position: "top_center",
      config: {
        lat: parseFloat(LAT), lon: parseFloat(LON),
        zoom: 10,
        overlay: "wind",
        pointKey : WINDY_POINT_KEY,
        mapKey   : WINDY_MAP_KEY,
        webcamKey: WINDY_WEBCAM_KEY,
        model: "gfs",
        radius_km: 25,
        updateInterval: 30 * 60 * 1000 // 30 min
      }
    },

    /* ─── AEMet Wetter Spanien ───────────────────────────── */
    { module: "MMM-AEMet",
      position: "bottom_left",
      config: {
        apiKey: AEMET_API_KEY,
        lat: parseFloat(LAT), lon: parseFloat(LON),
        updateInterval: 60 * 60 * 1000 // 1 h
      }
    },

    /* Platzhalter für weitere leichte Module (RSS u. ä.)   */
    // { module: "MMM-SurfRSS", ... }
  ]
};

/* ====== Do not edit below ====== */
if (typeof module !== "undefined") { module.exports = config; }
