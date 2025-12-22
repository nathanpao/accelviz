# AccelViz - Accelerometer Data Visualization

A web application for visualizing and analyzing accelerometer motion data from `.txt` files.

## Features

- **File Upload**: Browser-based upload of accelerometer data files
- **Motion Timeline**: Visualize when motion events occur and their duration
- **Session Analysis**: Bar charts showing individual session durations with statistics
- **Active/Idle Time**: Pie chart breakdown of active vs idle time
- **Time Series**: Line charts of X and Y acceleration over time
- **Statistics Summary**: Key metrics and analysis results

## Modular Architecture

The application is built with modularity in mind, allowing easy modification of individual components:

### Components (`src/components/`)
- `ActiveIdleChart.js` - Pie chart for active/idle time
- `SessionDurationsChart.js` - Bar chart for session durations
- `TimeSeriesChart.js` - Line chart for acceleration data
- `MotionTimelineChart.js` - Timeline of motion events
- `FileUpload.js` - File upload interface
- `StatisticsSummary.js` - Statistics display panel

### Utilities (`src/utils/`)
- `dataParser.js` - Data parsing and analysis logic (ported from Python)

Each component is self-contained and can be modified independently without affecting others.

## Installation

```bash
cd accelviz-web
npm install
```

## Running the Application

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Data Format

The application expects `.txt` files with the following format:

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

## Customizing Visualizations

To modify or add new visualizations:

1. **Create a new component** in `src/components/`
2. **Import necessary chart libraries** from `recharts`
3. **Add the component** to `DashboardPage.js`
4. **Pass required data** from the parsed results

Example:
```javascript
// src/components/MyCustomChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Paper, Typography } from '@mui/material';

function MyCustomChart({ data }) {
  return (
    <Paper sx={{ padding: '20px' }}>
      <Typography variant="h6">My Custom Chart</Typography>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="value" fill="#0072BD" />
      </BarChart>
    </Paper>
  );
}

export default MyCustomChart;
```

## Technology Stack

- **React 18** - UI framework
- **Material-UI (MUI)** - Component library
- **Recharts** - Charting library
- **JavaScript** - Programming language

## Design Principles

- **No Backend Required**: All processing happens in the browser
- **No Authentication**: Direct access for simplicity
- **Modular Components**: Easy to modify and extend
- **Responsive Design**: Works on desktop and mobile
- **Clean Interface**: Follows Material Design principles

## Sample Data

Test files are available in `/accelviz/data/`:
- `Test Data 1 accelerationdata.txt`
- `Test Data 2 accelerationdata.txt`

## License

MIT
