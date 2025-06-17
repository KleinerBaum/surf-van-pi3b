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
