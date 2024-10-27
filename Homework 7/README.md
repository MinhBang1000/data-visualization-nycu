# Seoul District Pollution Patterns: A Visualization in Horizon Charts

This project visualizes pollution patterns across districts in Seoul, South Korea, using horizon charts. The visualization allows users to explore daily pollutant levels for each district in an intuitive grid or stacked layout, using a color-coded system for various pollutants.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Setup Instructions](#setup-instructions)
4. [Usage Instructions](#usage-instructions)
5. [File Structure](#file-structure)
6. [Technical Details](#technical-details)
7. [Additional Notes](#additional-notes)

## Project Overview

This visualization shows daily air pollution data for 25 districts in Seoul from 2017 to 2019, covering six pollutants:
- CO (Carbon Monoxide)
- NO₂ (Nitrogen Dioxide)
- O₃ (Ozone)
- PM2.5 (Fine Particulate Matter)
- PM10 (Coarse Particulate Matter)
- SO₂ (Sulfur Dioxide)

Each combination of district and pollutant has a dedicated horizon chart that displays daily averages for a chosen year. Users can:
- Toggle between grid and stacked views
- Select the number of color bands to highlight intensity levels
- Change the displayed year
- Hover over each chart to see detailed daily information

## Features

1. **Interactive Horizon Charts**: Display pollution levels in a visually concise format.
2. **Toggle Between Grid and Stacked Views**: The grid view organizes charts by district and pollutant, while the stacked view presents them sequentially.
3. **Adjustable Color Bands**: Change the number of bands to refine visual intensity.
4. **Year Selection**: Filter the data by year (2017, 2018, or 2019).
5. **Tooltip for Detailed Information**: Hover over each chart to see daily values, date, and pollutant bands.

## Setup Instructions

1. **Clone the Repository or just extract my zip file**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Dependencies**:
   - This project uses [D3.js](https://d3js.org/) for data visualization. No additional libraries are required.

3. **Data Source**:
   - The dataset used is from [Kaggle's Air Pollution in Seoul](https://www.kaggle.com/datasets/bappekim/air-pollution-in-seoul). Ensure that the `air-pollution.csv` file is in the same directory as `index.html`.

4. **Open the Application**:
   - Open `index.html` in a browser to run the visualization.
   - **Note**: For local file access in some browsers, you may need to serve the files through a simple HTTP server (e.g., using `Live Server` in Visual Studio Code or `python -m http.server`).

## Usage Instructions

1. **Load the Application**: Open `index.html` in a browser.
2. **Select Year**: Use the dropdown menu to choose 2017, 2018, or 2019.
3. **Adjust Number of Bands**: Modify the number of color bands to change how pollution levels are segmented by intensity.
4. **Toggle View**: Click the "Toggle Grid View" button to switch between grid and stacked layouts.
5. **Hover for Tooltip**: Move your mouse over the charts to view detailed information about pollution levels on specific dates.

## File Structure

- **313540015.html**: Main HTML file for the project, containing the layout and structure.
- **313540015.css**: Stylesheet file to define the visual styling of the page, including the layout and tooltip.
- **313540015.js**: JavaScript file that:
  - Processes and aggregates the data
  - Generates horizon charts using D3.js
  - Implements interactivity and layout toggling
- **air-pollution.csv**: Dataset containing pollution levels for each district in Seoul from 2017 to 2019 (required for the app to function).

## Technical Details

### 1. Data Processing
The `dataProcessing` function aggregates hourly pollution data into daily averages, which are visualized in the horizon charts.

### 2. Horizon Chart Generation
The `createHorizonChart` function creates a horizon chart for each district and pollutant combination using D3’s `area` function. Color bands are applied based on pollutant levels and the selected number of bands.

### 3. Interactive Features
- **Tooltip**: Tooltips show detailed information about daily pollution levels.
- **Grid/Stack Toggle**: The `render` function provides both grid and stacked layouts, allowing users to compare data across districts and pollutants.

### 4. Dynamic Controls
- **Band Selection**: An input field allows users to adjust the number of color bands, enhancing data granularity.
- **Year Selection**: The dropdown menu filters data by year.

## Additional Notes

- **Browser Compatibility**: The application is designed for modern browsers that support D3.js. For the best experience, use Chrome or Firefox.
- **Performance**: Generating 150 charts can be resource-intensive. For optimal performance, avoid running multiple instances simultaneously and consider reducing the number of bands if experiencing slowness.