import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearClient } from "../../features/authSlice";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearClient());
  }, []);
  return (
    <div className="home">
      <div className="home__content">
        <div>
          <h2>Digitalisez vos cartes! </h2>
          <h4>
            XXXX permet l'affichage dynamique et interactif de votre carte, vous
            pouvez gérer en quelques clics vos plats, menu, dessert et tous se
            met à jour automatiquement ...
          </h4>

          <Link to="/scan-code">
            <button className="home__content__btn">Notre Menu </button>
          </Link>
        </div>
        <img className="scan" src="images/scan.jpg" />
      </div>
    </div>
  );
};

export default Home;
