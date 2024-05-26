import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FlightsDetail from "./components/FlightsDetail";
import FlightsCrud from "./components/FlightsCrud";
import Navigation from "./components/Navigation";

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<FlightsDetail />} />
          <Route path="/letovi-crud" element={<FlightsCrud />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
