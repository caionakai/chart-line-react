import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const CANVAS_WIDTH = 620;
const CANVAS_HEIGHT = 400;

const getMaxMinXYFromData = (data) => {
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

const sortData = (data) => {
  const dataCopy = [...data]; // make it a pure function
  const compare = (a, b) => {
    if (a.x < b.x) {
      return -1;
    }
    if (a.x > b.x) {
      return 1;
    }
    return 0;
  };

  return dataCopy.sort(compare);
};

const drawPoint = (canvasContext, data_x_position, data_y_position) => {
  canvasContext.beginPath();
  canvasContext.arc(data_x_position, data_y_position, 2, 0, 2 * Math.PI, true);
  canvasContext.closePath();
  canvasContext.fill();
};

const LineChart = ({ data }) => {
  const canvasRef = useRef(null);

  const CHART_X_START = 40;
  const CHART_X_END = 575;
  const CHART_Y_START = 30;
  const CHART_Y_END = 365;

  const CHART_HEIGHT = CHART_Y_END - CHART_Y_START;
  const CHART_WIDTH = CHART_X_END - CHART_X_START;

  const drawAxis = (canvasContext) => {
    // draw X and Y axis
    canvasContext.beginPath();
    canvasContext.moveTo(CHART_X_START, CHART_Y_START);
    canvasContext.lineTo(CHART_X_START, CHART_Y_END);
    canvasContext.lineTo(CHART_X_END, CHART_Y_END);
    canvasContext.stroke();
  };

  const drawHorizontalReferenceLines = (canvasContext, MinMaxXYValues) => {
    const referenceLines = 10;
    const DATA_INTERVAL = MinMaxXYValues.MAX_Y_DATA_VALUE / 10;
    for (let i = 0; i < referenceLines; i++) {
      canvasContext.beginPath();
      canvasContext.moveTo(
        CHART_X_START,
        CHART_Y_START + (CHART_HEIGHT / referenceLines) * i
      );
      canvasContext.lineTo(
        CHART_X_END,
        CHART_Y_START + (CHART_HEIGHT / referenceLines) * i
      );
      canvasContext.stroke();
      canvasContext.fillText(
        Math.round(MinMaxXYValues.MAX_Y_DATA_VALUE - i * DATA_INTERVAL),
        CHART_X_START - 25,
        CHART_Y_START + (CHART_HEIGHT / referenceLines) * i + 5
      );
    }
  };

  const drawVerticalReferenceLines = (canvasContext, MinMaxXYValues) => {
    const referenceLines = 10;
    const DATA_INTERVAL = MinMaxXYValues.MAX_X_DATA_VALUE / 10;
    for (let i = 1; i <= referenceLines; i++) {
      canvasContext.beginPath();
      canvasContext.moveTo(
        CHART_X_START + (CHART_WIDTH / referenceLines) * i,
        CHART_Y_START
      );
      canvasContext.lineTo(
        CHART_X_START + (CHART_WIDTH / referenceLines) * i,
        CHART_Y_END
      );
      canvasContext.stroke();
      canvasContext.fillText(
        Math.round(i * DATA_INTERVAL),
        CHART_X_START + (CHART_WIDTH / referenceLines) * i - 5,
        CHART_Y_END + 20
      );
    }
  };

  const drawCartesianPlane = (canvasContext, MinMaxXYValues) => {
    canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // clear canvas
    canvasContext.fillStyle = "#222631"; // background color
    canvasContext.strokeStyle = "white"; // axis lines color
    canvasContext.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    canvasContext.lineWidth = 3;
    drawAxis(canvasContext);
    canvasContext.lineWidth = 1;

    canvasContext.strokeStyle = "#BBB"; // ref lines color
    canvasContext.fillStyle = "white"; // reference text color
    drawHorizontalReferenceLines(canvasContext, MinMaxXYValues);
    drawVerticalReferenceLines(canvasContext, MinMaxXYValues);
  };

  const drawData = (data, canvasContext, MinMaxXYValues) => {
    canvasContext.fillStyle = "#66FF66";
    canvasContext.strokeStyle = "#66FF66";
    data.forEach((dataValue, idx) => {
      const currentDataXPosition =
        (dataValue.x * CHART_WIDTH) / MinMaxXYValues.MAX_X_DATA_VALUE +
        CHART_X_START;
      const currentDataYPosition =
        CHART_Y_END -
        (dataValue.y * CHART_HEIGHT) / MinMaxXYValues.MAX_Y_DATA_VALUE;

      const nextIdx = data[idx + 1] ? idx + 1 : idx;

      const nextDataXPosition =
        (data[nextIdx].x * CHART_WIDTH) / MinMaxXYValues.MAX_X_DATA_VALUE +
        CHART_X_START;
      const nextDataYPosition =
        CHART_Y_END -
        (data[nextIdx].y * CHART_HEIGHT) / MinMaxXYValues.MAX_Y_DATA_VALUE;

      canvasContext.lineWidth = 2;
      canvasContext.beginPath();
      canvasContext.moveTo(currentDataXPosition, currentDataYPosition);
      canvasContext.lineTo(nextDataXPosition, nextDataYPosition);
      canvasContext.stroke();
      canvasContext.closePath();
      drawPoint(canvasContext, currentDataXPosition, currentDataYPosition);
    });
  };

  useEffect(() => {
    const canvasContext = canvasRef.current.getContext("2d");
    const sortedData = sortData(data);
    const MinMaxXYValues = getMaxMinXYFromData(sortedData);
    drawCartesianPlane(canvasContext, MinMaxXYValues);
    drawData(sortedData, canvasContext, MinMaxXYValues);
  }, []);

  return (
    <div>
      <canvas
        id="mycanvas"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        ref={canvasRef}
      ></canvas>
    </div>
  );
};

LineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default LineChart;
