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
        <div className="home__content__side">
          <h2>Digitalisez vos cartes! </h2>
          <p>
            XXXX permet l'affichage dynamique et interactif de votre carte, vous
            pouvez gérer en quelques clics vos plats, menu, dessert et tous se
            met à jour automatiquement ...
          </p>
          <Link to="/scan-code">
            <button className="home__content__btn">Notre Menu </button>
          </Link>
        </div>
        <div className="scan">
          <img src="images/bg.png" />
        </div>
      </div>
      <div className="home__sante">
        <p>Votre santé est une priorité !</p>
        <p>
          digitMenu a été mise en place afin de garantir autant que possible
          votre santé et celle des autres
        </p>
      </div>
    </div>
  );
};

export default Home;
