Here's a README file for your homework based on the format you've provided:

---

# Visualizing House Property Sales Over Time with a ThemeRiver Chart - Homework 6

## Structure
The project consists of the following files:
- `313540015.html`: The main HTML file that serves as the entry point for the ThemeRiver chart visualization.
- `313540015.js`: The JavaScript file that contains the D3.js logic for generating the ThemeRiver chart, adding interactivity, and handling user interactions like tooltips, stream reordering, and layout toggling. (Please change the path of dataset before run)
- `313540015.css`: The CSS file for styling the application, including the chart layout, legend, and guide panel.
- `ma_lga_12345.csv`: The dataset file containing the property sales data that is visualized using the ThemeRiver chart (If you want to run on your computer).

## Run
To run the application, open the `313540015.html` file using Live Server or a local server. This will allow you to view the application in your web browser without encountering CORS issues.

### Instructions
1. **Live Server**: If you are using Visual Studio Code, you can install the Live Server extension. Right-click on `313540015.html` and select "Open with Live Server."
2. **Local Server**: Alternatively, you can set up a local server using Python or Node.js:
   - **Python**: Run the following command in the terminal within your project directory:
     ```bash
     python -m http.server 8000
     ```
   - **Node.js**: Install `http-server` globally and run:
     ```bash
     http-server
     ```

After starting the server, access your application at `http://localhost:8000` (or the appropriate address for your server setup).

## Features
- **Hover Interaction**: When you hover over a stream, the chart displays a tooltip with the property type, date, and the median price for that specific time.
- **Stream Reordering**: Drag and drop the legend items on the right to reorder the streams in the chart, giving you the ability to prioritize certain property types.
- **Stream Layout Toggle**: Use the toggle switch to change between two layout options: "Wiggle" (a flowing, river-like layout) and "Baseline" (aligned to a common base for easier comparison).
- **Stream Visibility**: You can hide or show specific streams by checking/unchecking the boxes next to each property type in the legend.
- **Smooth Transitions**: The chart has animated transitions for reordering, layout changes, and visibility toggles to enhance the user experience.
- **Hover Line**: A vertical guide line appears as you hover over the streams to help track the exact position and price across streams.