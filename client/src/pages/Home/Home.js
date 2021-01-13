import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <div className="home__content">
        <h2>Always Choose Good</h2>
        <p>Use your smartphone to read the code qr to access our menu</p>
        <Link to="/scan-code">
          <button className="home__content__btn">our menu </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
