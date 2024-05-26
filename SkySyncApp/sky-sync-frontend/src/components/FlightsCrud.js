import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../index";

const LetoviCrud = () => {
  const [letovi, setLetovi] = useState([]);
  const [zrakoplovi, setZrakoplovi] = useState([]);
  const [piste, setPiste] = useState([]);
  const [odredista, setOdredista] = useState([]);
  const [selectedLet, setSelectedLet] = useState(null);
  const [formData, setFormData] = useState({
    vrijeme_polaska: "",
    trajanje: "",
    cijena: "",
    zrakoplov_id: "",
    pista_id: "",
    odrediste_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const letoviRes = await axios.get("http://localhost:5000/letovi");
        setLetovi(letoviRes.data);

        const zrakoploviRes = await axios.get(
          "http://localhost:5000/zrakoplovi"
        );
        setZrakoplovi(zrakoploviRes.data);

        const pisteRes = await axios.get("http://localhost:5000/piste");
        setPiste(pisteRes.data);

        const odredistaRes = await axios.get("http://localhost:5000/odredista");
        setOdredista(odredistaRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "vrijeme_polaska") {
      const formattedDateTime = value.replace("T", " ").slice(0, 16);
      setFormData({ ...formData, [name]: formattedDateTime });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (selectedLet) {
      const formattedDate = new Date(formData.vrijeme_polaska)
        .toISOString()
        .split("T")[0];
      setFormData({ ...formData, vrijeme_polaska: formattedDate });
      axios
        .put(`http://localhost:5000/let/${selectedLet.let_id}`, formData)
        .then((response) => {
          setLetovi(
            letovi.map((flight) =>
              flight.let_id === response.data.let_id ? response.data : flight
            )
          );
          setSelectedLet(null);
          setFormData({
            vrijeme_polaska: "",
            trajanje: "",
            cijena: "",
            zrakoplov_id: "",
            pista_id: "",
            odrediste_id: "",
          });
        });
    } else {
      axios.post("http://localhost:5000/let", formData).then((response) => {
        setLetovi([...letovi, response.data]);
        setFormData({
          vrijeme_polaska: "",
          trajanje: "",
          cijena: "",
          zrakoplov_id: "",
          pista_id: "",
          odrediste_id: "",
        });
      });
    }
  };

  const handleEdit = (flight) => {
    setSelectedLet(flight);
    setFormData({
      vrijeme_polaska: flight.vrijeme_polaska,
      trajanje: flight.trajanje,
      cijena: flight.cijena,
      zrakoplov_id: flight.zrakoplov_id,
      pista_id: flight.pista_id,
      odrediste_id: flight.odrediste_id,
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/let/${id}`).then((response) => {
      setLetovi(letovi.filter((flight) => flight.let_id !== id));
    });
  };

  const uniqueZrakoplovi = [
    ...new Map(
      zrakoplovi.map((zrakoplov) => [zrakoplov.model, zrakoplov])
    ).values(),
  ];

  return (
    <div className="container">
      <h2 className="title">Upravljanje letovima</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          className="search-input"
          type="datetime-local"
          name="vrijeme_polaska"
          value={formData.vrijeme_polaska}
          onChange={handleInputChange}
          required
        />
        <input
          className="search-input"
          type="time"
          name="trajanje"
          value={formData.trajanje}
          onChange={handleInputChange}
          required
        />
        <input
          className="search-input"
          type="number"
          step="0.01"
          name="cijena"
          value={formData.cijena}
          onChange={handleInputChange}
          required
        />
        <select
          className="flight-select"
          name="zrakoplov_id"
          value={formData.zrakoplov_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Odaberite zrakoplov</option>
          {uniqueZrakoplovi.map((zrakoplov) => (
            <option key={zrakoplov.zrakoplov_id} value={zrakoplov.zrakoplov_id}>
              {zrakoplov.model}
            </option>
          ))}
        </select>
        <select
          className="flight-select"
          name="pista_id"
          value={formData.pista_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Odaberite pistu</option>
          {piste.map((pista) => (
            <option key={pista.pista_id} value={pista.pista_id}>
              {pista.pista_id}
            </option>
          ))}
        </select>
        <select
          className="flight-select"
          name="odrediste_id"
          value={formData.odrediste_id}
          onChange={handleInputChange}
          required
        >
          <option value="">Odaberite odredište</option>
          {odredista.map((odrediste) => (
            <option key={odrediste.odrediste_id} value={odrediste.odrediste_id}>
              {odrediste.grad}
            </option>
          ))}
        </select>

        <button className="search-button" type="submit">
          {selectedLet ? "Update" : "Create"}
        </button>
      </form>
      <ul>
        {letovi.map((flight) => (
          <li key={flight.let_id}>
            {new Date(flight.vrijeme_polaska).toLocaleString()} -{" "}
            {flight.trajanje} - {flight.cijena} - Zrakoplov:{" "}
            {flight.zrakoplov_model} - Pista: {flight.pista_id}- Odredište:{" "}
            {flight.odrediste_grad}
            <button className="edit-button" onClick={() => handleEdit(flight)}>
              Edit
            </button>
            <button
              className="search-button"
              onClick={() => handleDelete(flight.let_id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LetoviCrud;
