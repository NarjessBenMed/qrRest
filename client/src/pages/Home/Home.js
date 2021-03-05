import React, { useEffect } from "react";

import { initState } from "../../features/authSlice";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { RiFacebookCircleFill } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { ImWhatsapp } from "react-icons/im";
import { IconContext } from "react-icons";
import { useDispatch, useSelector } from "react-redux";

import ContactUs from "../../Components/ContactUs/ContactUs.js";
import { getRestInfo } from "../../features/adherentSlice.js";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initState());
  }, []);
  const { adherentStatus, errors, adherents } = useSelector(
    (state) => state.adherent
  );
  useEffect(() => {
    dispatch(getRestInfo());
  }, []);

  return (
    <div className="home">
      <div className="home__content">
        <div className="home__content__left">
          <h2>Digitalisez vos cartes! </h2>
          <p>
            DigitMenu permet l'affichage dynamique et interactif de votre carte,
            vous pouvez gérer en quelques clics vos plats, menu, dessert et tous
            se met à jour automatiquement ...
          </p>
          <Link to="/scan-code">
            <button className="home__content__btn">Notre Menu </button>
          </Link>
        </div>
        <div className="scan">
          <img src="images/bg-light.png" alt=" " />
        </div>
      </div>
      <div className="home__sante">
        <p>Votre santé est une priorité !</p>
        <p>
          DigitMenu a été conçue afin de garantir autant que possible votre
          santé et celle de vos clients!
        </p>
        <img src="images/Codiv-19.png" alt="" />
      </div>
      <section className="home__fonct" id="sect1">
        <h4>Utilisation simple et efficace sans installation :</h4>
        <div className="home__fonct__step">
          <IconContext.Provider value={{ className: "check-icon" }}>
            <div>
              <FaCheckCircle />
            </div>
          </IconContext.Provider>
          <p>
            Le consommateur a juste besoin de scanner un QR code affiché sur vos
            tables
          </p>
        </div>
        <div className="home__fonct__step">
          <IconContext.Provider value={{ className: "check-icon" }}>
            <div>
              <FaCheckCircle />
            </div>
          </IconContext.Provider>
          <p>
            Il est alors redirigé automatiquement vers votre carte dématérialisé
          </p>
        </div>
        <div className="home__fonct__step">
          <IconContext.Provider value={{ className: "check-icon" }}>
            <div>
              <FaCheckCircle />
            </div>
          </IconContext.Provider>
          <p>la commande est prise sans le moindre contact</p>
        </div>
        <div className="home__fonct__img">
          <img src="images/img1.png" alt="" />
          <div className="home__fonct__img__content">
            <img src="images/img2.png" alt="" />
            <IconContext.Provider value={{ className: "plus-icon" }}>
              <div>
                <FaPlusCircle />
              </div>
            </IconContext.Provider>
            <img src="images/img3.png" alt="" />
          </div>
        </div>
      </section>
      <div className="block">
        <p>Booster votre restaurant !</p>
        <p>
          Ouvrez vous des nouveaux horizons via le digital pour sortir de la
          crise du coronavirus
        </p>
      </div>

      <section className="home__avantages" id="sect2">
        <p>
          En plus du respect des gestes barrières et du nouveau mode de vie que
          nous devons adopter, le menu digital pour votre restaurant vous permet
          de mettre à jour en temps réel votre carte et d'offrir une expérience
          unique à vos clients.
        </p>
        <p>
          Consacrez-vous à votre art et ne gaspillez pas votre temps et votre
          énergie à désinfecter vos cartes pour chaque nouveau client. DigitMenu
          est une solution rapide, économique, qui respecte les gestes barrières
          pour vous libérer.
        </p>
        <p>
          Toutes les mises à jour de votre menu digital restaurant sont
          immédiatement visibles par vos clients. Un plat caché par suite d’une
          rupture de stock ou d'un problème en cuisine, un visuel à changer, un
          prix à adapter...le menu visible par vos clients est à jour, votre
          service est très largement amélioré.
        </p>
        <p>
          {" "}
          Vous limitez votre impact sur la nature en évitant les réimpressions
          régulières de vos cartes. Vous ne gaspillez plus de papier et vous
          diminuez vos déchets pour vous inscrire dans une démarche
          écoresponsable.
        </p>
      </section>
      <section className="home__adher" id="sect3">
        <h1> Les adhérents </h1>

        <div className="home__adher__items slider">
          <div className="slide-track">
            {adherentStatus === "loading" ? (
              <span>Loading...</span>
            ) : adherentStatus === "succeded" ? (
              adherents && adherents.length > 0 ? (
                adherents.map((adher) => (
                  <div className="slide" key={adher._id}>
                    <img className="images" src={adher.logo} alt="adherent" />
                  </div>
                ))
              ) : (
                <span>soyer le premier ..</span>
              )
            ) : (
              adherentStatus === "failed" && (
                <span>une erreur est survenue</span>
              )
            )}
          </div>
        </div>
      </section>

      <footer className="footer" id="sect4">
        <ContactUs />
        <div className="footer__content">
          <div className="social__contact">
            <div className="contact__us__left contact__us__border">
              <p>Nous contacter</p>
            </div>
            <div className="social__icons">
              <IconContext.Provider
                value={{ className: "social__icons__style" }}
              >
                <RiFacebookCircleFill />
              </IconContext.Provider>

              <IconContext.Provider
                value={{ className: "social__icons__style" }}
              >
                <FaInstagram />
              </IconContext.Provider>
              <IconContext.Provider
                value={{ className: "social__icons__style" }}
              >
                <ImWhatsapp />
              </IconContext.Provider>
            </div>
          </div>

          <p className="copy-right">
            &copy; 2021 Copyright all right reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
