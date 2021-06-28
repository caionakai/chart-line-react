import { useRef, useEffect } from "react";
import "./App.css";
import React from "react";

const CANVAS_WIDTH = 620;
const CANVAS_HEIGHT = 400;

function App() {
  const data = [
    { x: 10, y: 210 },
    { x: 50, y: 150 },
    { x: 95, y: 300 },
    { x: 100, y: 9 },
    { x: 100, y: 100 },
  ];

  const canvasRef = useRef(null);

  const CHART_X_START = 40;
  const CHART_X_END = 575;
  const CHART_Y_START = 30;
  const CHART_Y_END = 365;

  const CHART_HEIGHT = CHART_Y_END - CHART_Y_START;
  const CHART_WIDTH = CHART_X_END - CHART_X_START;

  const getMaxMinXYDataValue = () => {
    let MIN_MAX_X_Y_VALUES = {};
    MIN_MAX_X_Y_VALUES.MAX_X_DATA_VALUE = Math.max.apply(
      Math,
      data.map(function (dataValue) {
        return dataValue.x;
      })
    );
    MIN_MAX_X_Y_VALUES.MAX_Y_DATA_VALUE = Math.max.apply(
      Math,
      data.map(function (dataValue) {
        return dataValue.y;
      })
    );
    MIN_MAX_X_Y_VALUES.MIN_X_DATA_VALUE = Math.min.apply(
      Math,
      data.map(function (dataValue) {
        return dataValue.x;
      })
    );
    MIN_MAX_X_Y_VALUES.MIN_Y_DATA_VALUE = Math.min.apply(
      Math,
      data.map(function (dataValue) {
        return dataValue.y;
      })
    );

    return MIN_MAX_X_Y_VALUES;
  };

  const drawAxis = (canvasContext) => {
    // draw X and Y axis
    canvasContext.beginPath();
    canvasContext.moveTo(CHART_X_START, CHART_Y_START);
    canvasContext.lineTo(CHART_X_START, CHART_Y_END);
    canvasContext.lineTo(CHART_X_END, CHART_Y_END);
    canvasContext.stroke();
  };

  const drawHorizontalReferenceLines = (canvasContext, MIN_MAX_X_Y_VALUES) => {
    const NUMBER_OF_REFERENCE_LINES = 10;
    const DATA_INTERVAL = MIN_MAX_X_Y_VALUES.MAX_Y_DATA_VALUE / 10;
    for (let i = 0; i < NUMBER_OF_REFERENCE_LINES; i++) {
      canvasContext.beginPath();
      canvasContext.moveTo(
        CHART_X_START,
        CHART_Y_START + (CHART_HEIGHT / NUMBER_OF_REFERENCE_LINES) * i
      );
      canvasContext.lineTo(
        CHART_X_END,
        CHART_Y_START + (CHART_HEIGHT / NUMBER_OF_REFERENCE_LINES) * i
      );
      canvasContext.stroke();
      canvasContext.fillStyle = "#FFF";
      canvasContext.fillText(
        Math.round(MIN_MAX_X_Y_VALUES.MAX_Y_DATA_VALUE - i * DATA_INTERVAL),
        CHART_X_START - 25,
        CHART_Y_START + (CHART_HEIGHT / NUMBER_OF_REFERENCE_LINES) * i + 5
      );
    }
  };

  const drawVerticalReferenceLines = (canvasContext, MIN_MAX_X_Y_VALUES) => {
    const NUMBER_OF_REFERENCE_LINES = 10;
    const DATA_INTERVAL = MIN_MAX_X_Y_VALUES.MAX_X_DATA_VALUE / 10;
    for (let i = 1; i <= NUMBER_OF_REFERENCE_LINES; i++) {
      canvasContext.beginPath();
      canvasContext.moveTo(
        CHART_X_START + (CHART_WIDTH / NUMBER_OF_REFERENCE_LINES) * i,
        CHART_Y_START
      );
      canvasContext.lineTo(
        CHART_X_START + (CHART_WIDTH / NUMBER_OF_REFERENCE_LINES) * i,
        CHART_Y_END
      );
      canvasContext.stroke();
      canvasContext.fillText(
        Math.round(
          MIN_MAX_X_Y_VALUES.MIN_X_DATA_VALUE + (i - 1) * DATA_INTERVAL
        ),
        CHART_X_START + (CHART_WIDTH / NUMBER_OF_REFERENCE_LINES) * i - 5,
        CHART_Y_END + 20
      );
    }
  };

  const prepareChart = (canvasContext) => {
    canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // clear canvas
    canvasContext.fillStyle = "#222631"; // bg color
    canvasContext.strokeStyle = "white"; // axis lines color
    canvasContext.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawAxis(canvasContext);
    canvasContext.strokeStyle = "#BBB"; // ref lines color

    let MIN_MAX_X_Y_VALUES = getMaxMinXYDataValue();

    drawHorizontalReferenceLines(canvasContext, MIN_MAX_X_Y_VALUES);
    drawVerticalReferenceLines(canvasContext, MIN_MAX_X_Y_VALUES);
  };

  const drawData = (canvasContext) => {
    canvasContext.fillStyle = "#66FF66";
    canvasContext.strokeStyle = "#66FF66";
    data.forEach((dataValue, idx) => {
      canvasContext.beginPath();
      canvasContext.lineWidth = 2;
      const data_x_position = (dataValue.x * CHART_WIDTH) / 100 + CHART_X_START;
      const data_y_position = CHART_Y_END - (dataValue.y * CHART_HEIGHT) / 300;
      const nextIdx = data[idx + 1] ? idx + 1 : idx;
      const next_data_x_position =
        (data[nextIdx].x * CHART_WIDTH) / 100 + CHART_X_START;
      const next_data_y_position =
        CHART_Y_END - (data[nextIdx].y * CHART_HEIGHT) / 300;
      canvasContext.moveTo(data_x_position, data_y_position);

      canvasContext.lineTo(next_data_x_position, next_data_y_position);
      canvasContext.stroke();
      canvasContext.closePath();
      canvasContext.beginPath();
      canvasContext.arc(
        data_x_position,
        data_y_position,
        2,
        0,
        2 * Math.PI,
        true
      );
      canvasContext.closePath();
      canvasContext.fill();
    });
  };

  useEffect(() => {
    const canvasContext = canvasRef.current.getContext("2d");
    prepareChart(canvasContext);
    drawData(canvasContext);
  }, []);

  return (
    <div className="App">
      <canvas
        id="mycanvas"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        ref={canvasRef}
      ></canvas>
    </div>
  );
}

export default App;
