# AccelViz - Accelerometer Data Visualization

A desktop application for visualizing and analyzing accelerometer data from Explorer Mini devices. AccelViz helps researchers understand when and how often powered wheelchairs were used by analyzing acceleration events rather than continuous motion tracking.

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

AccelViz analyzes **acceleration detection events** from accelerometer sensors, not continuous movement. This is important because:

- The accelerometer detects when acceleration starts and stops (triggers)
- It does NOT track sustained movement at constant speeds
- Data reflects usage patterns (when/how often device was used), not travel distance or duration

### Key Metrics

**Session Statistics:**
- Number of Sessions - device on/off cycles
- Total Session Length - how long device was powered on
- Days with Detection - unique days the device was used
- Dates Used - specific dates of usage

**Event Statistics:**
- Total Detection Events - number of acceleration detection triggers
- Mean/Max/Min Duration - statistics about detection event lengths

---

## Features

### Data Visualization

- **Acceleration Detection Timeline** - Shows when acceleration events occurred and their duration
- **Daily Event Count Chart** - Displays acceleration events per day as a bar chart
- **Event Durations Chart** - Bar chart showing individual event durations with average line
- **Acceleration Time Series** - X/Y acceleration data over time (during acceleration events only)
- **Statistics Summary** - Comprehensive session and event metrics

### Session Management

- **Session Selector** - Switch between viewing individual device sessions or all sessions combined
- **Filtered Events** - Only includes events with minimum duration of 1.0 seconds
- **Automatic Parsing** - Handles device startup events, acceleration detection triggers, and sample-based duration calculation

---

## Application Architecture

### Project Structure

```
accelviz-web/
├── src/
│   ├── components/          # Modular React components
│   ├── pages/               # Application pages
│   └── utils/               # Data parsing logic
├── public/                  # Static assets
├── electron.js              # Electron main process
└── package.json             # Dependencies and build config
```

---

## Data Format

The application expects `.txt` files with the following structure:

```
Device start up at: 08/14/2025 09:18:00:00PM
X:
-10.11
Y:
-0.64
Start Time of Motion Detected At: 08/14/2025 09:18:45:12PM
X:
-10.08
Y:
-0.47
...
Time of Stop Detected At: 08/14/2025 09:19:15:12PM
```

### Data Structure

- **Device Startup Events** - Each "Device start up at:" line creates a new session
- **Acceleration Detection Events** - "Start Time of Motion Detected At:" triggers mark when acceleration is detected
- **Stop Events** - "Time of Stop Detected At:" marks when acceleration stops
- **Acceleration Data** - X/Y values collected during acceleration events only
- **Sample Rate** - 100 Hz (10ms per sample) for duration calculations

### Naming Convention

- **Sessions** = Device on/off cycles (device startup → shutdown)
- **Events** = Acceleration detection triggers (start → stop pairs)

**Note:** The data structure internally uses `movementEvents` (device sessions) containing `motionSessions` (detection events), but the UI displays swapped terminology for clarity.

---

## Technology Stack

- **React 18** - UI framework with functional components and hooks
- **Material-UI v6** - Component library for consistent design
- **Recharts 2** - Declarative charting library
- **Electron** - Desktop application wrapper
- **JavaScript (ES6+)** - Programming language

---

## Design Principles

- **Offline-First**: All processing happens locally in the browser, no backend required
- **Privacy-Focused**: No data leaves the user's computer
- **Modular Architecture**: Components are independent and easily extensible
- **Responsive Design**: Adapts to different screen sizes
- **Material Design**: Clean, professional interface following Google's design system
- **No Authentication**: Direct access for simplicity in research contexts

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

## Troubleshooting

**Issue: "Error parsing file"**
- Verify file format matches expected structure
- Check that timestamps are in format "MM/DD/YYYY HH:MM:SS:ff AM/PM"
- Ensure X/Y data appears after acceleration detection markers

**Issue: No events showing in charts**
- Events must have minimum duration of 1.0 seconds
- Check that "Start Time of Motion Detected At:" and "Time of Stop Detected At:" are present
- Verify timestamps are valid dates
---

## License

MIT License - see LICENSE file for details

---

## Credits

Created for accelerometer data analysis research at the University of Washington. Ported to JavaScript for browser-based accessibility by Nathan Pao for UW CREATE.
