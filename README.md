# 🏄‍♂️ Surf-Van Dashboard – Pi 3B Edition

Optimiertes Setup für den Raspberry Pi 3 Model B (1 GB RAM).

- MagicMirror² mit schlanken Modulen (Surf, Uhr, Wetter)
- Wetter- und Swell-Daten per Python-Skripte
- Home Assistant Core (ohne Docker)
- Optional: Kiosk-Info-Screen via Chromium
- Mediennutzung extern (z.B. Handy/Tablet/Kodi-Stick)

**Hinweis:** Nicht alle Dienste gleichzeitig laufen lassen!

## Setup-Quickstart

1. Pi OS installieren
2. Repository klonen: `git clone https://github.com/DEINREPO/surf-van-pi3b.git`
3. Installation ausführen: `bash install_all_pi3b.sh`
4. API-Keys in `.env` eintragen
5. Cronjob für Wetter/Swell einrichten
6. MagicMirror oder Home Assistant starten

## Wetter-Skripte

Im Ordner `scripts/` liegen Helfer für AEMet, Pirate Weather und Windy. Sie
speichern JSON-Dateien, die von den MagicMirror-Modulen gelesen werden.

```bash
python scripts/aemet_fetch.py
python scripts/pirateweather_fetch.py
python scripts/windy_api_fetch.py
```

Die zugehörigen MagicMirror-Module befinden sich unter
`magicmirror/modules/MMM-AEMet`, `MMM-PirateWeather` und `MMM-WindyForecast`.

Das Skript `surf_weather_cron.py` kombiniert Surfline-, Tide- und Wetterdaten und
legt sie in `~/MagicMirror/modules/MMM-Surf/data.json` ab.

