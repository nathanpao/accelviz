# AccelViz - Distribution Guide

## Building the Desktop Application

AccelViz is packaged as a standalone desktop application using Electron. No installation or technical setup required for end users.

### Building for macOS

```bash
npm run dist:mac
```

This creates:
- `dist/AccelViz-1.0.0.dmg` - macOS installer (drag-and-drop)
- `dist/AccelViz-1.0.0-mac.zip` - Portable macOS app

**For your supervisor:**
1. Send them the `.dmg` file
2. They double-click to open
3. Drag AccelViz to Applications folder
4. Done! They can now double-click AccelViz to launch

### Building for Windows

```bash
npm run dist:win
```

This creates:
- `dist/AccelViz Setup 1.0.0.exe` - Windows installer
- `dist/AccelViz 1.0.0.exe` - Portable Windows app (no install needed)

**For your supervisor:**
1. Send them the portable `.exe` file
2. They double-click to run
3. No installation needed - it just works

### Building for Both Platforms

```bash
npm run dist
```

Builds for your current platform automatically.

## What Gets Created

Each build produces a ~150MB application file that includes:
- The complete AccelViz web interface
- All necessary libraries and dependencies
- A minimal Chromium browser
- Node.js runtime

**No internet connection needed** - everything runs offline.

## File Size

- macOS: ~140-160 MB
- Windows: ~150-170 MB

## Distribution

Simply send your supervisor the appropriate file:
- **macOS users**: Send the `.dmg` file
- **Windows users**: Send the portable `.exe` file

They won't need to:
- Install Node.js
- Run terminal commands
- Know anything about npm, React, or web development
- Have an internet connection (after download)

## First-Time Setup (For You)

Before building, make sure you've run:

```bash
npm install
```

Then you can build whenever needed with `npm run dist:mac` or `npm run dist:win`.

## Testing Locally

To test the Electron app before building:

```bash
# In one terminal:
npm start

# In another terminal:
npm run electron-dev
```

This opens the app in an Electron window for testing.

## Notes

- The built application will be in the `dist/` folder
- The first build takes 5-10 minutes
- Subsequent builds are faster
- You can only build Windows installers on Windows (or use a Windows VM)
- You can only build macOS installers on macOS
