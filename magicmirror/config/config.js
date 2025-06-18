/***************************************************************
 * MagicMirror² – Surf-Van Dashboard Konfiguration
 * -------------------------------------------------------------
 *  ▸ Minimal / Pi-3B+-optimiert
 *  ▸ Lädt .env → API-Keys & Koordinaten
 *  ▸ Keine PirateWeather-, Home-Assistant- oder Media-Module
 ***************************************************************/

require("dotenv").config(); // .env → process.env.*

const {
  WINDY_POINT_KEY,
  WINDY_MAP_KEY,
  WINDY_WEBCAM_KEY,
  AEMET_API_KEY,
  LAT = 36.721,
  LON = -4.421
} = process.env;

/*=============================================================
 = Haupt-Konfigobjekt
 =============================================================*/
var config = {
  address: "0.0.0.0",   // von allen Interfaces erreichbar
  port: 8080,
  basePath: "/",        // unverändert lassen
  ipWhitelist: [],      // [] = Zugriff aus allen Netzen
  language: "de",       // DE als Default, Umschalten per UI-Modul möglich
  timeFormat: 24,
  units: "metric",

  /*-----------------------------------------------------------
   |  Module
   +----------------------------------------------------------*/
  modules: [
    /* HEADER ------------------------------------------------*/
    { module: "clock",    position: "top_left" },
    { module: "calendar", position: "top_right",
      config: {
        maximumEntries: 6,
        calendars: [
          {
            symbol: "calendar",
            url: "https://www.calendarlabs.com/ical-calendar/ics/76/Germany_Holidays.ics"
          }
        ]
      }
    },

    /* SURF-RSS – Gruppe 1-3 --------------------------------*/
    {
      module: "MMM-SurfRSS",
      position: "top_center",
      header: "Surf Feeds 1-3",
      config: {
        feeds: [
          "https://www.surfer.com/feed",
          "https://stabmag.com/feed",
          "https://www.surfertoday.com/rss"
        ],
        updateInterval: 15 * 60 * 1000
      }
    },

    /* SURF-RSS – Gruppe 5-7 --------------------------------*/
    {
      module: "MMM-SurfRSS",
      position: "top_center",
      header: "Surf Feeds 5-7",
      config: {
        feeds: [
          "https://magicseaweed.com/news/rss/",
          "https://www.noaa.gov/ocean-news/feed",
          "https://www.surfnews.com/rss"
        ],
        updateInterval: 15 * 60 * 1000
      }
    },

    /* SURF-RSS – Gruppe 9-10 -------------------------------*/
    {
      module: "MMM-SurfRSS",
      position: "top_center",
      header: "Surf Feeds 9-10",
      config: {
        feeds: [
          "https://www.eurosurfing.org/rss",
          "https://www.surfersvillage.com/feed/"
        ],
        updateInterval: 15 * 60 * 1000
      }
    },

    /* WINDY – Forecast-Map + Webcams -----------------------*/
    {
      module: "MMM-WindyForecast",
      position: "top_center",
      config: {
        lat: parseFloat(LAT),
        lon: parseFloat(LON),
        zoom: 9,
        overlay: "wind",
        pointKey : WINDY_POINT_KEY,
        mapKey   : WINDY_MAP_KEY,
        webcamKey: WINDY_WEBCAM_KEY,
        model: "gfs",
        radius_km: 30,
        updateInterval: 30 * 60 * 1000
      }
    },

    /* AEMet – offizielles Wetter Spanien -------------------*/
    {
      module: "MMM-AEMet",
      position: "bottom_left",
      config: {
        apiKey: AEMET_API_KEY,
        lat: parseFloat(LAT),
        lon: parseFloat(LON),
        updateInterval: 60 * 60 * 1000
      }
    }

    /* Weitere leichte Module können hier angehängt werden.  */
  ]
};

/*=============================================================
 = Export nicht entfernen
 =============================================================*/
if (typeof module !== "undefined") { module.exports = config; }
