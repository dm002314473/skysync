import React from "react";
import { Link } from "react-router-dom";
import "./../index";

const Navigation = () => {
  return (
    <div className="navigation">
      <Link to="/">Pretraga</Link>
      <Link to="/letovi-crud">CRUD</Link>
    </div>
  );
};

export default Navigation;
