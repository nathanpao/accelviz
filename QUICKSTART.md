# AccelViz Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd accelviz-web
npm install
```

### 2. Start the Application
```bash
npm start
```

The app will automatically open at [http://localhost:3000](http://localhost:3000)

### 3. Upload Data
- Click "Select File" or drag and drop a `.txt` file
- Sample data files are available in `../accelviz/data/`
- Visualizations will appear automatically

## First Test

Try uploading one of the sample files:
```bash
# Use the test data from the accelviz directory
../accelviz/data/Test Data 1 accelerationdata.txt
```

## What You'll See

After uploading a file, you'll see:

1. **Motion Events Timeline** - Bar chart showing when motion occurred
2. **Session Durations** - Duration of each motion session with average line
3. **Active vs Idle Time** - Pie chart breakdown
4. **Acceleration Time Series** - X and Y acceleration over time
5. **Statistics Summary** - Key metrics and analysis

## Modifying Visualizations

### Change Chart Colors
Edit `src/components/[ChartName].js`:

```javascript
// Example: Change bar color
<Bar dataKey="duration" fill="#D95319" />
```

### Add New Chart
1. Create `src/components/MyChart.js`
2. Import in `src/pages/DashboardPage.js`
3. Add to Grid layout

### Customize Theme
Edit `src/App.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#YOUR_COLOR' },
  },
});
```

## File Structure

```
src/
├── components/        # All chart components
├── pages/            # Dashboard page
├── utils/            # Data parsing logic
├── App.js            # Main app + theme
└── index.js          # Entry point
```

## Common Tasks

**Upload new file:**
- Click "Upload New File" button

**Build for production:**
```bash
npm run build
```

**Deploy static site:**
- Upload `build/` folder to any static host (Netlify, Vercel, GitHub Pages)

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm start
```

**Dependencies not installing:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**File won't parse:**
- Ensure file is `.txt` format
- Check file contains motion events and X/Y data
- See `PROJECT_STRUCTURE.md` for expected format

## Next Steps

- Read [README.md](README.md) for full features
- See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for architecture details
- Explore components in `src/components/` directory

## Support

For issues or questions, check the main documentation files:
- `README.md` - Features and usage
- `PROJECT_STRUCTURE.md` - Architecture and customization
- Sample data in `../accelviz/data/`
