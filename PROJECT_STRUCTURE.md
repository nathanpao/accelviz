# AccelViz Project Structure

## Overview
AccelViz is a modular web application for visualizing accelerometer data. The architecture is designed for easy modification and extension of individual components.

## Directory Structure

```
accelviz-web/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── ActiveIdleChart.js          # Pie chart: Active vs Idle time
│   │   ├── SessionDurationsChart.js    # Bar chart: Session durations
│   │   ├── TimeSeriesChart.js          # Line chart: Acceleration over time
│   │   ├── MotionTimelineChart.js      # Bar chart: Motion event timeline
│   │   ├── FileUpload.js               # File upload interface
│   │   └── StatisticsSummary.js        # Statistics panel
│   ├── pages/
│   │   └── DashboardPage.js    # Main dashboard layout
│   ├── utils/
│   │   └── dataParser.js       # Data parsing and analysis logic
│   ├── App.js                  # Main app component with theme
│   └── index.js                # Application entry point
├── package.json                # Dependencies and scripts
├── README.md                   # User documentation
└── .gitignore                  # Git ignore rules
```

## Component Architecture

### Visualization Components

Each chart component is self-contained and follows this pattern:

```javascript
function ComponentName({ data, ...props }) {
  // 1. Handle empty/invalid data
  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  // 2. Process/transform data for chart
  const chartData = processData(data);

  // 3. Render chart with Recharts
  return (
    <Paper>
      <Typography>Chart Title</Typography>
      <ResponsiveContainer>
        <ChartType data={chartData}>
          {/* Chart configuration */}
        </ChartType>
      </ResponsiveContainer>
    </Paper>
  );
}
```

**Benefits:**
- Easy to modify chart types
- Simple to add new visualizations
- Can be reordered in dashboard without conflicts
- Props-based, no global state dependencies

### Data Flow

```
User Upload File
    ↓
FileUpload Component
    ↓
DashboardPage (handleFileLoaded)
    ↓
dataParser.parseAccelFile()
    ↓
Process data (filter, compute stats)
    ↓
Pass data to visualization components
    ↓
Render charts
```

## Modifying Visualizations

### Adding a New Chart

1. **Create component file:**
   ```bash
   touch src/components/MyNewChart.js
   ```

2. **Implement component:**
   ```javascript
   import React from 'react';
   import { BarChart, Bar, XAxis, YAxis } from 'recharts';
   import { Paper, Typography } from '@mui/material';

   function MyNewChart({ data }) {
     return (
       <Paper sx={{ padding: '20px' }}>
         <Typography variant="h6">My New Chart</Typography>
         <BarChart data={data}>
           <XAxis dataKey="x" />
           <YAxis />
           <Bar dataKey="y" fill="#0072BD" />
         </BarChart>
       </Paper>
     );
   }

   export default MyNewChart;
   ```

3. **Add to DashboardPage:**
   ```javascript
   import MyNewChart from '../components/MyNewChart';

   // In the Grid layout:
   <Grid item xs={12} md={6}>
     <MyNewChart data={parsedData.accelData} />
   </Grid>
   ```

### Modifying Existing Charts

Each chart component is in `src/components/`. To modify:

1. **Change chart type:** Swap Recharts component (BarChart → LineChart, etc.)
2. **Change colors:** Update `fill` or `stroke` props
3. **Change data processing:** Modify the data transformation logic
4. **Change layout:** Update Grid sizes in DashboardPage

Example - Change SessionDurationsChart color:
```javascript
// In src/components/SessionDurationsChart.js
<Bar
  dataKey="duration"
  fill="#D95319"  // Changed from #0072BD
  name="Duration"
/>
```

### Modifying Data Parser

The `dataParser.js` utility contains all data processing logic:

- **`parseAccelFile(content)`** - Parse raw .txt file
- **`filterMotionEvents(events, minDuration)`** - Filter events
- **`computeActivityStats(events)`** - Calculate active/idle time
- **`calculateStats(durations)`** - Compute statistics

To add new calculations:

```javascript
// In src/utils/dataParser.js
export function calculateNewMetric(data) {
  // Your calculation logic
  return result;
}

// In DashboardPage.js
const newMetric = calculateNewMetric(parsedData.accelData);
```

## Styling and Theming

### Theme Configuration
Theme is defined in `src/App.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#0072BD' },    // Blue
    secondary: { main: '#D95319' },  // Orange
  },
  // ... other theme settings
});
```

### Color Palette
Consistent with baby-diagnostics:
- **Primary Blue:** `#0072BD`
- **Secondary Orange:** `#D95319`
- **Yellow:** `#EDB120`
- **Purple:** `#7E2F8E`
- **Green:** `#77AC30`
- **Cyan:** `#4DBEEE`

### Component Styling
Uses Material-UI's `sx` prop for inline styles:

```javascript
<Paper sx={{
  padding: '20px',
  backgroundColor: '#f7f9fc',
  borderRadius: '12px'
}}>
```

## Data Format

### Input File Format
Expected `.txt` file structure:

```
Device start up at: 08/14/2025 09:18:00:00PM
X: -10.11
Y: -0.64
Start Time of Motion Detected At: 08/14/2025 09:18:45:12PM
X: -10.08
Y: -0.47
...
Time of Stop Detected At: 08/14/2025 09:19:15:12PM
```

### Parsed Data Structure

```javascript
{
  motionEvents: [
    { start: Date, stop: Date },
    ...
  ],
  accelData: [
    { x: Number, y: Number, timestamp: Date, index: Number },
    ...
  ],
  deviceStartTime: Date
}
```

## Development Workflow

### Running Development Server
```bash
npm start
```
Opens at http://localhost:3000 with hot reload

### Building for Production
```bash
npm run build
```
Creates optimized build in `build/` directory

### Testing
```bash
npm test
```

### Common Development Tasks

**Add a new visualization:**
1. Create component in `src/components/`
2. Import in `DashboardPage.js`
3. Add to Grid layout
4. Pass required data props

**Modify data processing:**
1. Edit `src/utils/dataParser.js`
2. Update function logic
3. Update calls in `DashboardPage.js`

**Change layout:**
1. Edit Grid items in `DashboardPage.js`
2. Adjust `xs`, `md`, `lg` breakpoints
3. Reorder components as needed

**Update styling:**
1. Modify theme in `App.js` for global changes
2. Edit component `sx` props for local changes

## Performance Considerations

- **Large datasets:** TimeSeriesChart automatically samples data (shows max 500 points)
- **Chart animations:** Some charts disable animations for better performance
- **File size:** No limit imposed, but large files may take longer to parse

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers supported via responsive design

## Future Enhancement Ideas

- Multi-file comparison view
- Export charts as PNG/PDF
- Download processed data as CSV
- Local storage for session history
- Additional chart types (scatter plot, heatmap)
- Custom date range selection
- Real-time data streaming support
