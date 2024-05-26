import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../index";

const formatDate = (date) => {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const LetoviDetail = () => {
  const today = formatDate(new Date());

  const [letovi, setLetovi] = useState([]);
  const [filteredLetovi, setFilteredLetovi] = useState([]);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndtDate] = useState(today);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedLetId, setSelectedLetId] = useState(null);
  const [selectedLet, setSelectedLet] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/letovi")
      .then((response) => {
        setLetovi(response.data);
        setFilteredLetovi(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the flights!", error);
      });
  }, []);

  useEffect(() => {
    if (selectedLetId) {
      const foundLet = filteredLetovi.find(
        (letItem) => letItem.let_id === parseInt(selectedLetId)
      );
      setSelectedLet(foundLet || null);
    }
  }, [selectedLetId, filteredLetovi]);

  const handleSearch = () => {
    let filteredLetovi = [...letovi];

    if (!startDate && !endDate && !selectedDestination) {
      setFilteredLetovi(letovi);
      return;
    }

    if (selectedDestination && !startDate && !endDate) {
      filteredLetovi = letovi.filter((letItem) =>
        letItem.odrediste_grad
          .toLowerCase()
          .includes(selectedDestination.toLowerCase())
      );
      setFilteredLetovi(filteredLetovi);
      return;
    }

    if (startDate && endDate && !selectedDestination) {
      filteredLetovi = letovi.filter(
        (letItem) =>
          new Date(letItem.vrijeme_polaska) >= new Date(startDate) &&
          new Date(letItem.vrijeme_polaska) <= new Date(endDate)
      );
      setFilteredLetovi(filteredLetovi);
      return;
    }

    if (startDate && endDate && selectedDestination) {
      filteredLetovi = letovi.filter(
        (letItem) =>
          new Date(letItem.vrijeme_polaska) >= new Date(startDate) &&
          new Date(letItem.vrijeme_polaska) <= new Date(endDate) &&
          letItem.odrediste_grad
            .toLowerCase()
            .includes(selectedDestination.toLowerCase())
      );
      setFilteredLetovi(filteredLetovi);
      return;
    }
  };

  return (
    <div className="container">
      <h2 className="title">Pregled i pretraživanje letova</h2>
      <div className="search-bar">
        <label className="search-label">
          Početni datum:
          <input
            className="search-input"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label className="search-label">
          Krajnji datum:
          <input
            className="search-input"
            type="date"
            value={endDate}
            onChange={(e) => setEndtDate(e.target.value)}
          />
        </label>
        <label className="search-label">
          Odredište:
          <input
            className="search-input"
            type="text"
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
          />
        </label>
        <button className="search-button" onClick={handleSearch}>
          Pretraži
        </button>
      </div>
      <select
        className="flight-select"
        onChange={(e) => setSelectedLetId(e.target.value)}
      >
        <option value="">Odaberite let</option>
        {filteredLetovi.map((letItem) => (
          <option key={letItem.let_id} value={letItem.let_id}>
            {new Date(letItem.vrijeme_polaska).toLocaleString()} -{" "}
            {letItem.odrediste_grad}
          </option>
        ))}
      </select>
      {selectedLet && (
        <div className="flight-details">
          <h3>Detalji leta</h3>
          <p>
            Vrijeme polaska:{" "}
            {new Date(selectedLet.vrijeme_polaska).toLocaleString()}
          </p>
          <p>Trajanje: {selectedLet.trajanje}</p>
          <p>Cijena: {selectedLet.cijena}</p>
          <p>Zrakoplov: {selectedLet.zrakoplov_model}</p>
          <p>Pista ID: {selectedLet.pista_id}</p>
          <p>Odredište: {selectedLet.odrediste_grad}</p>
        </div>
      )}
    </div>
  );
};

export default LetoviDetail;
