#!/bin/bash
set -e

echo ">> System-Update und Grundpakete..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y git python3-pip python3-venv unclutter

echo ">> (Optional) Chromium für Kiosk-Modus..."
sudo apt install -y chromium-browser

echo ">> MagicMirror² installieren..."
if [ ! -d ~/MagicMirror ]; then
  git clone https://github.com/MichMich/MagicMirror.git ~/MagicMirror
  cd ~/MagicMirror && npm install
fi

echo ">> Nur schlanke Module laden (z.B. MMM-Surf)..."
cd ~/MagicMirror/modules
if [ ! -d MMM-Surf ]; then
  git clone https://github.com/surfguru-de/MMM-Surf.git
fi

echo ">> Python-Umgebung für Wetter/Swell..."
cd ~/surf-van-pi3b
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

echo ">> Home Assistant Core (ohne Docker) installieren..."
sudo apt install -y libffi-dev libssl-dev python3-dev
pip install wheel
pip install homeassistant

echo ">> Autostart für MagicMirror anlegen (LXDE)..."
sed -i '/@npm start/d' ~/.config/lxsession/LXDE-pi/autostart || true
echo "@bash -c 'cd ~/MagicMirror && DISPLAY=:0 npm start'" >> ~/.config/lxsession/LXDE-pi/autostart

echo ">> (Optional) Kiosk-Info-Screen einrichten..."
mkdir -p ~/surf-van-pi3b/static
cp webinfo.html ~/surf-van-pi3b/static/index.html

echo ">> Fertig! Jetzt .env einrichten und Dienste nach Bedarf starten."
