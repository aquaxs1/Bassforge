# BassForge

Song-Mixer mit Bass-Boost, DAW-Timeline und Video-Export im TikTok-Style – als App für **Windows, Android und iOS**.

- Mehrere Songs auf Spuren, verschieben, zuschneiden, teilen, Fades und Auto-Crossfades
- Effekte pro Clip: Speed, Bass, Sub-Layer, Drive (nur auf dem Bass), Bass-Frequenz, Höhen, Reverb, Mono
- Presets: Deep Sub, Punch, Sped-up Boost, Bass Boosted, Slowed + Reverb, Nightcore …
- Export als Audio (MP4/AAC oder WebM) oder als Video mit Titel und Version (15 Schriftarten, Farben, Hintergrund, Glow, Streifen, Puls zum Bass …)
- Anleitung, Einstellungen (Design, Akzentfarbe, Sprache DE/EN, Export-Ordner) und Verlauf im Menü oben rechts
- Alles läuft lokal, nichts wird hochgeladen

## Download

Jeder Push auf `main` baut automatisch alle drei Apps (GitHub Actions → *Build BassForge*).
Die fertigen Dateien liegen danach unter **Releases** (und als Artifacts am Workflow-Lauf):

| Plattform | Datei | Installation |
|---|---|---|
| Windows | `BassForge-Setup-x.y.z.exe` / `BassForge-Portable-x.y.z.exe` | Setup ausführen oder Portable direkt starten. Beim ersten Start kann Windows SmartScreen warnen („Weitere Informationen → Trotzdem ausführen“), weil die App nicht signiert ist. |
| Android | `BassForge-Android.apk` | Aufs Handy laden, öffnen, „Installation aus unbekannten Quellen“ erlauben. |
| iOS | `BassForge-iOS-unsigned.ipa` | Unsigniert – mit [AltStore](https://altstore.io) oder [Sideloadly](https://sideloadly.io) und deiner Apple-ID installieren. Für den App Store / TestFlight braucht es einen Apple-Developer-Account. |

## Selbst bauen

```bash
npm install
npm start            # Desktop-App lokal starten
npm run dist:win     # Windows-Installer (unter Windows)
npm run cap:sync     # Web-Teil in Android/iOS-Projekte kopieren (nach `npx cap add android|ios`)
npm run build:artifact  # Einzeldatei-Version für den Browser (dist-web/index.html)
```

## Aufbau

```
src/index.html          Die komplette App (Oberfläche + Audio-Engine), eine Datei
src/logo.png            Logo
scripts/build-web.mjs   Baut www/ (Schriften und Bibliotheken lokal, offline-fähig)
electron/               Windows-App (Fenster, Export-Ordner, Speichern)
capacitor.config.json   Android- und iOS-App
assets/                 Quellen für App-Icons und Splashscreen
.github/workflows/      Automatischer Build für Windows, Android, iOS
```
