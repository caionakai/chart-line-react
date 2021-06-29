import "./App.css";
import React from "react";
import LineChart from "./components/LineChart";

function App() {
  const data = [
    { x: 100, y: 9 },
    { x: 10, y: 210 },
    { x: 95, y: 400 },
    { x: 200, y: 100 },
    { x: 50, y: 150 },
  ];
  return (
    <div className="App" style={{ backgroundColor: "#222631" }}>
      <LineChart data={data} />
    </div>
  );
}

export default App;
