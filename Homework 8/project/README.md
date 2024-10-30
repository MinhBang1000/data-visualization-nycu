# Car Evaluation Sankey Diagram

This project creates an interactive **Sankey Diagram** using **D3.js** to visualize relationships within a car evaluation dataset. The diagram provides insights into various categorical attributes, such as buying price, maintenance cost, doors, persons, luggage boot size, and safety.

## Features

- **Interactive Draggable Nodes**: Allows users to rearrange nodes for better visualization and focus on specific relationships.
- **Hover Tooltips**: Displays data values and percentages when hovering over links.
- **Link Color Customization**: Provides multiple color schemes, including gradients for source-target links.
- **PDF Export**: Allows users to save the diagram as a PDF for easy sharing and offline access.
- **Path Highlighting**: Click on nodes to highlight specific paths and analyze targeted relationships.
- **Tooltip Toggle**: Users can enable or disable tooltips for an uncluttered view.

## How to Run This Code

1. **Extract my archive file** .

2. **Open the `313540015.html` file** in your browser to view the Sankey Diagram.
   - Use a local server if necessary, such as **Live Server** in Visual Studio Code, to ensure the JavaScript and data load correctly.

3. **Interact with the Diagram**:
   - Toggle the tooltip display.
   - Export the diagram to PDF if needed.
   - Drag nodes to rearrange the diagram or click nodes to highlight paths.

## Folder Structure

```
.
├── 313540015.html       # Main HTML file to render the Sankey Diagram
├── 313540015.js         # JavaScript with D3.js code to create the Sankey Diagram
├── 313540015.css        # Custom CSS styling for the Sankey Diagram
├── car.data             # CSV file containing car evaluation data
├── README.md            # Documentation file
```

## Data Analysis

The **car evaluation dataset** is sourced from the UCI Machine Learning Repository. The analysis includes:

1. **Data Transformation**: The data is preprocessed to create pairwise combinations and calculate the frequency counts for each attribute relationship.
2. **Frequency Representation**: Link widths represent each relationship’s count for proportional analysis.
3. **Attribute Mapping**: Attributes like buying price, safety, and maintenance are grouped by categories, providing visual insights on car characteristics.

### Data Attributes

The dataset includes:
- **Buying Price**: Levels include `vhigh`, `high`, `med`, `low`
- **Maintenance**: Levels include `vhigh`, `high`, `med`, `low`
- **Doors**: Options include `2`, `3`, `4`, `5more`
- **Persons**: Capacity options `2`, `4`, `more`
- **Luggage Boot**: Sizes include `small`, `med`, `big`
- **Safety**: Levels include `low`, `med`, `high`

## Version Information

This project uses:
- **D3.js version 7**
- **D3-Sankey version 0.12.3**

## Homework Overview

The objective of this project is to create an interactive Sankey Diagram to visualize categorical relationships in car evaluation data. Key requirements include:
- Data preprocessing to calculate frequency counts.
- Implementing draggable nodes and interactive tooltips.
- Enabling color customization and a PDF export feature.
- Adding path highlighting for targeted analysis.

The Sankey Diagram allows users to explore relationships between car attributes, facilitating a clearer understanding of car evaluation data.