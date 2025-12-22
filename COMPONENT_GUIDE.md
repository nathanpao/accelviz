# Component Modification Guide

This guide shows you how to modify each visualization component independently.

## Component Overview

### 1. ActiveIdleChart.js
**Purpose:** Displays active vs idle time as a pie chart

**Props:**
- `activeTime` (number) - Total active time in seconds
- `idleTime` (number) - Total idle time in seconds

**Key Customization Points:**

```javascript
// Change colors
const COLORS = ['#4CAF50', '#B0BEC5'];  // [Active, Idle]

// Modify pie chart radius
outerRadius={100}  // Change size

// Adjust label format
const renderLabel = (entry) => {
  const percentage = ((entry.value / totalTime) * 100).toFixed(1);
  return `${percentage}%`;  // Customize label
}
```

**Example Modifications:**
- Add inner radius for donut chart: `innerRadius={60}`
- Change start angle: `startAngle={90}`
- Add animations: `isAnimationActive={true}`

---

### 2. SessionDurationsChart.js
**Purpose:** Bar chart showing duration of each motion session

**Props:**
- `durations` (Array<number>) - Array of session durations in seconds
- `fileName` (string) - Name of the file being analyzed

**Key Customization Points:**

```javascript
// Change bar color
<Bar dataKey="duration" fill="#0072BD" />

// Modify average reference line
<ReferenceLine
  y={avgDuration}
  stroke="red"
  strokeDasharray="3 3"
/>

// Adjust bar border radius
<Bar radius={[4, 4, 0, 0]} />  // [topLeft, topRight, bottomRight, bottomLeft]
```

**Example Modifications:**
- Stack multiple bars: Add multiple `<Bar>` components
- Change to line chart: Replace `BarChart` with `LineChart`
- Add data labels: Use `label` prop on Bar

---

### 3. TimeSeriesChart.js
**Purpose:** Line chart showing X and Y acceleration over time

**Props:**
- `accelData` (Array<{x, y, timestamp, index}>) - Acceleration data points
- `fileName` (string) - Name of the file

**Key Customization Points:**

```javascript
// Change line colors
<Line dataKey="x" stroke="#0072BD" />  // X axis
<Line dataKey="y" stroke="#D95319" />  // Y axis

// Adjust sampling rate (for performance)
const sampleRate = Math.max(1, Math.floor(accelData.length / 500));

// Modify line style
strokeWidth={2}
dot={false}  // Hide/show dots
type="monotone"  // or "linear", "step", etc.
```

**Example Modifications:**
- Show dots on data points: `dot={true}`
- Add area under line: Use `<Area>` component
- Change line curve: `type="linear"` or `type="step"`
- Show more/fewer points: Adjust `500` in sampling calculation

---

### 4. MotionTimelineChart.js
**Purpose:** Timeline showing when motion events occurred and their duration

**Props:**
- `motionEvents` (Array<{start, stop}>) - Motion event objects

**Key Customization Points:**

```javascript
// Change bar color
<Cell fill="#77AC30" />

// Modify tooltip content
const CustomTooltip = ({ active, payload }) => {
  // Customize tooltip JSX
}

// Adjust chart margins
margin={{ top: 30, right: 30, left: 0, bottom: 20 }}
```

**Example Modifications:**
- Color bars by duration: Use conditional fill in Cell
- Add labels on bars: Use `label` prop
- Show event count: Add to Paper header

---

### 5. FileUpload.js
**Purpose:** File upload interface with drag-and-drop

**Props:**
- `onFileLoaded` (function) - Callback with file data `{fileName, content, size, lastModified}`

**Key Customization Points:**

```javascript
// Change file type filter
accept=".txt"  // Can add ",. csv" etc.

// Modify upload box styling
sx={{
  backgroundColor: '#f7f9fc',
  border: '2px dashed #ccc',
  // ... other styles
}}

// Validate file type
if (!file.name.endsWith('.txt')) {
  alert('Please upload a .txt file');
}
```

**Example Modifications:**
- Accept multiple formats: `accept=".txt,.csv"`
- Add file size limit: Check `file.size`
- Add drag-and-drop handler: `onDrop={handleDrop}`

---

### 6. StatisticsSummary.js
**Purpose:** Display summary statistics and metrics

**Props:**
- `fileName` (string) - Name of analyzed file
- `stats` (object) - Statistics object with metrics

**Stats Object Structure:**
```javascript
{
  totalSessions: number,
  activeTime: number,
  idleTime: number,
  meanDuration: number,
  maxDuration: number,
  minDuration: number,
  totalSamples: number
}
```

**Key Customization Points:**

```javascript
// Add new statistic row
<TableRow>
  <TableCell>New Metric</TableCell>
  <TableCell align="right">{value}</TableCell>
</TableRow>

// Modify number formatting
{meanDuration.toFixed(2)}s  // Change decimal places

// Add conditional styling
sx={{
  color: value > threshold ? 'green' : 'red'
}}
```

**Example Modifications:**
- Add percentage calculations
- Add color coding based on values
- Add charts/visualizations
- Group related metrics with Dividers

---

## Layout Customization (DashboardPage.js)

### Grid Layout Structure

```javascript
<Grid container spacing={3}>
  <Grid item xs={12} lg={8}>  {/* Left column - Charts */}
    <Grid item xs={12}>        {/* Full width */}
      <MotionTimelineChart />
    </Grid>
    <Grid item xs={12} md={6}>  {/* Half width on medium+ */}
      <ActiveIdleChart />
    </Grid>
  </Grid>
  <Grid item xs={12} lg={4}>  {/* Right column - Stats */}
    <StatisticsSummary />
  </Grid>
</Grid>
```

### Breakpoint Reference
- `xs` - Extra small (0px+) - Mobile
- `sm` - Small (600px+) - Tablet
- `md` - Medium (900px+) - Small laptop
- `lg` - Large (1200px+) - Desktop
- `xl` - Extra large (1536px+) - Large desktop

### Common Layout Changes

**Single column layout:**
```javascript
<Grid container spacing={3}>
  <Grid item xs={12}>
    <ComponentName />
  </Grid>
</Grid>
```

**Two equal columns:**
```javascript
<Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    <Component1 />
  </Grid>
  <Grid item xs={12} md={6}>
    <Component2 />
  </Grid>
</Grid>
```

**Three columns:**
```javascript
<Grid item xs={12} md={4}>
  <Component />
</Grid>
```

---

## Color Reference

Consistent color palette from baby-diagnostics:

```javascript
const COLORS = {
  primaryBlue: '#0072BD',
  secondaryOrange: '#D95319',
  yellow: '#EDB120',
  purple: '#7E2F8E',
  green: '#77AC30',
  cyan: '#4DBEEE',
  activeGreen: '#4CAF50',
  idleGray: '#B0BEC5'
};
```

Use these colors across components for consistency.

---

## Adding New Calculations (dataParser.js)

### Current Functions

1. **parseAccelFile(content)** - Parse raw file
2. **filterMotionEvents(events, minDuration)** - Filter events
3. **computeActivityStats(events)** - Calculate active/idle time
4. **calculateStats(durations)** - Compute statistics

### Adding New Function

```javascript
// In src/utils/dataParser.js
export function calculateNewMetric(data) {
  // Your calculation
  const result = data.map(/* transform */);
  return result;
}

// In src/pages/DashboardPage.js
const handleFileLoaded = (fileData) => {
  const { motionEvents, accelData } = parseAccelFile(fileData.content);

  // Add your calculation
  const newMetric = calculateNewMetric(accelData);

  // Pass to component
  setParsedData({
    ...parsedData,
    newMetric: newMetric
  });
};
```

---

## Common Customization Recipes

### Change All Chart Colors to Green Theme

```javascript
// SessionDurationsChart.js
<Bar fill="#4CAF50" />

// TimeSeriesChart.js
<Line dataKey="x" stroke="#4CAF50" />
<Line dataKey="y" stroke="#66BB6A" />

// MotionTimelineChart.js
<Cell fill="#4CAF50" />
```

### Add Download Chart as Image

```javascript
// Install html2canvas
npm install html2canvas

// In component
import html2canvas from 'html2canvas';

const downloadChart = () => {
  html2canvas(chartRef.current).then(canvas => {
    const link = document.createElement('a');
    link.download = 'chart.png';
    link.href = canvas.toDataURL();
    link.click();
  });
};
```

### Make Charts Taller

```javascript
// In any chart component
<ResponsiveContainer width="100%" height={500}>  // Increase from 300
```

### Add Loading State

```javascript
// In DashboardPage.js
const [loading, setLoading] = useState(false);

const handleFileLoaded = async (fileData) => {
  setLoading(true);
  // ... parsing logic
  setLoading(false);
};

// In render
{loading && <CircularProgress />}
```

---

## Testing Your Changes

1. **Save the file** - Changes auto-reload with `npm start`
2. **Upload a test file** - Use sample data from `../accelviz/data/`
3. **Check console** - Look for errors in browser DevTools
4. **Verify visual** - Ensure chart displays correctly

## Need Help?

- Check component PropTypes for required props
- Use browser DevTools to inspect rendered charts
- Recharts documentation: https://recharts.org/
- Material-UI documentation: https://mui.com/
