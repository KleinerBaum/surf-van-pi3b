# 🏄‍♂️ Surf-Van Dashboard – Pi 3B Edition

Optimiertes Setup für den Raspberry Pi 3 Model B (1 GB RAM):

- MagicMirror² (mit leichten Modulen: Surf, Uhr, Wetter)
- Wetter- und Swell-Daten automatisch per Python-Skript
- Home Assistant Core (ohne Docker)
- Optional: Kiosk-Info-Screen (Chromium, ein Tab)
- Mediennutzung: Extern (z. B. Handy/Tablet/Kodi-Stick), da Pi 3B zu schwach für Kodi + alles andere

**Hinweis:**  
Nicht alle Dienste gleichzeitig laufen lassen! Pi 3B ist limitiert – Fokus auf ein, max. zwei Hauptdienste.

## **Setup-Quickstart**

1. Frisches Pi OS „Lite“ oder „Desktop“ installieren  
2. Repo klonen:  
   `git clone https://github.com/DEINREPO/surf-van-pi3b.git`
3. Installation starten:  
   `bash install_all_pi3b.sh`
4. API-Keys in `.env` eintragen  
5. Cronjob für Wetter/Swell einrichten  
6. MagicMirror oder Home Assistant je nach Bedarf starten

## **Tipps**
- Nicht zu viele grafische Module!
- Chromium nur als Kiosk, nicht zum Surfen
- Home Assistant am besten separat (nicht parallel zu MM)

## Wetter-Skripte

In `scripts/` liegen Helfer für AEMet und Pirate Weather. Sie legen JSON-Dateien an,
die von MagicMirror-Modulen genutzt werden können.

```bash
python scripts/aemet_fetch.py
python scripts/pirateweather_fetch.py
```

Die zugehörigen MagicMirror-Module befinden sich unter
`magicmirror/modules/MMM-AEMet` und `magicmirror/modules/MMM-PirateWeather`.

Das Skript `surf_weather_cron.py` kombiniert diese Daten automatisch.
Es ruft Surfline und Tide-Infos ab und nutzt AEMet als Quelle für
Wettervorhersagen. Schlägt dies fehl, springt Pirate Weather ein.
Alle Daten landen gebündelt in `~/MagicMirror/modules/MMM-Surf/data.json`.
