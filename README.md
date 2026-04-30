# AccelViz - Accelerometer Data Visualization

A desktop application for visualizing and analyzing accelerometer data from powered wheelchairs. AccelViz helps researchers understand wheelchair usage patterns by analyzing acceleration detection events and motion intensity.

**[Analysis & Design Rationale](https://docs.google.com/document/d/1RiwQZUqN_yzni_gGMT1-958Rf6r3m6kly21VlSQjOFU/edit?usp=sharing)** — Read this for detailed methodology, hardware constraints, and metric design decisions.

## Quick Start

### For End Users (Recommended)

**If you received an executable file:**

- **macOS**: Double-click `AccelViz-1.0.0.dmg`, drag to Applications, then launch AccelViz
- **Windows**: Double-click `AccelViz 1.0.0.exe` - no installation needed, just run

That's it! No technical setup required.

### For Developers

#### Local Development

```bash
cd accelviz-web
npm install
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

#### Building Desktop Executables

**macOS:**
```bash
npm run dist:mac
```
Creates: `dist/AccelViz-1.0.0.dmg` and `dist/AccelViz-1.0.0-mac.zip`

**Windows (requires Windows or Windows VM):**
```bash
npm run dist:win
```
Creates: `dist/AccelViz Setup 1.0.0.exe` and `dist/AccelViz 1.0.0.exe` (portable)

**Both platforms:**
```bash
npm run dist
```

See [README-DISTRIBUTION.md](README-DISTRIBUTION.md) for detailed distribution instructions.

---

## What AccelViz Measures

AccelViz analyzes **acceleration detection events** from accelerometer sensors mounted on powered wheelchairs. This is critical to understand:

- The accelerometer detects when acceleration changes (starts, stops, turns, jolts)
- It does NOT measure sustained movement at constant speeds
- "Idle" does not mean stationary — smooth rolling at steady speed produces no acceleration change and appears as Idle
- Data reflects usage patterns (when/how often device was used), not travel distance or velocity

### Key Metrics

**Session Statistics:**
- Number of Sessions — device on/off cycles
- Total Session Length — how long device was powered on
- Days with Detection — unique days the device was active
- Daily Motion Event Counts — number of acceleration changes per day

**Event Statistics:**
- Total Detection Events — number of acceleration triggers
- Mean/Max/Min Duration — statistics about event lengths
- Peak Deviation — maximum motion intensity in a session (g-units)
- Motion Energy — total accumulated intensity (Σ|deviation|) — proxy for "how much movement"

---

## Features

### Data Visualization

- **Motion Detection Timeline** — When acceleration events occurred and their duration
- **Daily Event Count Chart** — Acceleration events per day with dates
- **Event Durations Chart** — Individual event durations with average line
- **Acceleration Time Series** — X/Y/Z acceleration data during events (toggle axes on/off)
  - Sensor-relative axes; mounting orientation varies, so do not interpret as fixed directions
- **Device-Flagged Events Pie Chart** — Proportion of recorded time with detected acceleration vs. no change
- **Analysis Summary Sidebar** — Comprehensive session and event metrics in one place

### Session Management

- **Session Selector** — Switch between viewing individual device sessions or all sessions combined
- **Filtered Events** — Only includes events with minimum duration of 1.0 seconds
- **Automatic Parsing** — Handles device startup events, acceleration triggers, timestamps, and sample-based duration

### Data Quality

- Baseline calculation uses minimum-variance window (most stable segment of data)
- Active/idle classification based on magnitude deviation from computed baseline
- All charts include brief notes explaining what the data represents

---

## Application Architecture

### Project Structure

```
accelviz-web/
├── src/
│   ├── components/          # Modular React components
│   │   ├── ChartNote.js     # Consistent interpretation notes
│   │   ├── ActiveIdlePieChart.js
│   │   ├── TimeSeriesChart.js
│   │   └── ...
│   ├── pages/               # Application pages
│   ├── utils/               # Data parsing and analysis
│   └── index.js
├── public/                  # Static assets
├── electron.js              # Electron main process
├── package.json             # Dependencies and build config
└── ANALYSIS_LOG.md          # Data validation log and design rationale
```

---

## Data Format

The application expects `.txt` files with the following structure:

```
Device start up at: 08/14/2025 09:18:00:00PM
Start Time of Motion Detected At: 08/14/2025 09:18:45:12PM
X:
-0.97
Y:
0.05
Z:
-1.43
...
Time of Stop Detected At: 08/14/2025 09:19:15:12PM
```

### Data Structure

- **Device Startup Events** — Each "Device start up at:" line creates a new session
- **Acceleration Detection Events** — "Start Time of Motion Detected At:" marks when acceleration is detected
- **Stop Events** — "Time of Stop Detected At:" marks when acceleration stops
- **Acceleration Data** — X/Y/Z values collected during acceleration events only
- **Sample Rate** — Nominal 100 Hz (10ms per sample), but effective rate varies by device (~1-10 Hz observed)

### Naming Convention

- **Sessions** = Device on/off cycles (device startup → shutdown)
- **Events** = Acceleration detection triggers (start → stop pairs)

---

## Technology Stack

- **React 18** — UI framework with functional components and hooks
- **Material-UI v6** — Component library for consistent design
- **Recharts 2** — Declarative charting library
- **Electron** — Desktop application wrapper
- **JavaScript (ES6+)** — Programming language

---

## Design Principles

- **Offline-First** — All processing happens locally in the browser, no backend required
- **Privacy-Focused** — No data leaves the user's computer
- **Transparent** — Every chart includes a note explaining what the data means and limitations
- **Hardware-Aware** — Explicitly documents sample rate constraints and what cannot be measured
- **Modular Architecture** — Components are independent and easily extensible
- **Responsive Design** — Adapts to different screen sizes
- **Material Design** — Clean, professional interface following Google's design system

---

## Development Scripts

```bash
npm start          # Run development server (localhost:3000)
npm run build      # Create production web build
npm test           # Run tests
npm run electron   # Test Electron app with built files
npm run dist       # Build desktop app for current platform
npm run dist:mac   # Build macOS app (.dmg + .zip)
npm run dist:win   # Build Windows app (.exe installer + portable)
```

---

## Building for Production

### Web Build Only
```bash
npm run build
```
Creates optimized static files in `build/` folder.

### Desktop Application
```bash
npm run dist:mac    # macOS
npm run dist:win    # Windows
```

Output files appear in `dist/` folder:
- **macOS**: `.dmg` installer and `.zip` archive (~150 MB)
- **Windows**: `.exe` installer and portable `.exe` (~160 MB)

---

## Important Notes on Interpretation

### What the Data Can Tell You

✅ **Usage patterns** — When and how often the wheelchair was used  
✅ **Activity intensity** — Peak motion and total motion energy per session  
✅ **Event frequency** — How many acceleration changes occurred per day  
✅ **Session duration** — How long the device was powered on  

### What the Data Cannot Tell You

❌ **Distance traveled** — Sample rate too low for reliable integration  
❌ **Direction of travel** — Mounting orientation unknown and variable  
❌ **Velocity** — Integration drift makes estimates unreliable at ~1-10 Hz  
❌ **Continuous movement** — Steady-speed rolling produces no acceleration (appears as Idle)  

---

## Troubleshooting

**Issue: "Error parsing file"**
- Verify file format matches expected structure
- Check that timestamps are in format "MM/DD/YYYY HH:MM:SS:ff AM/PM"
- Ensure X/Y/Z data appears after acceleration detection markers

**Issue: No events showing in charts**
- Events must have minimum duration of 1.0 seconds
- Check that "Start Time of Motion Detected At:" and "Time of Stop Detected At:" are present
- Verify timestamps are valid dates

**Issue: Active/Idle percentages seem off**
- "Idle" includes periods of steady-speed motion (no acceleration change detected)
- Device-flagged events (pie chart) count only explicit start/stop triggers
- Magnitude deviation (analytical stats) counts any detected acceleration change
- These will rarely match — that's expected

---

## License

MIT License — see LICENSE file for details

---

## Credits

Created for accelerometer data analysis research at the University of Washington. Ported to JavaScript for browser-based accessibility by Nathan Pao for UW CREATE.

For detailed analysis methodology, hardware constraints, and design decisions, see the [Analysis & Design Rationale document](https://docs.google.com/document/d/1RiwQZUqN_yzni_gGMT1-958Rf6r3m6kly21VlSQjOFU/edit?usp=sharing).
