import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearClient } from "../../features/authSlice";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { IconContext } from "react-icons";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearClient());
  }, []);
  return (
    <div className="home">
      <div className="home__content">
        <div className="home__content__left">
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
          <img src="images/bg-light.png" />
        </div>
      </div>
      <div className="home__sante">
        <p>Votre santé est une priorité !</p>
        <p>
          digitMenu a été conçue afin de garantir autant que possible votre
          santé et celle de vos clients!
        </p>
        <img src="images/Codiv-19.png" alt="" />
      </div>
      <section className="home__fonct">
        <h4>Utilisation simple et efficace sans installation :</h4>
        <div className="home__fonct__step">
          <IconContext.Provider value={{ className: "check-icon" }}>
            <div>
              <FiCheckCircle />
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
              <FiCheckCircle />
            </div>
          </IconContext.Provider>
          <p>
            Il est alors redirigé automatiquement vers votre carte dématérialisé
          </p>
        </div>
        <div className="home__fonct__step">
          <IconContext.Provider value={{ className: "check-icon" }}>
            <div>
              <FiCheckCircle />
            </div>
          </IconContext.Provider>
          <p>la commande est prise sans le moindre contact</p>
        </div>
        <div className="home__fonct__img">
          <img src="images/img1.png" alt="" />

          <img src="images/img2.png" alt="" />
          <img src="images/img3.png" alt="" />
        </div>
      </section>
      <section className="home__avantages">
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
    </div>
  );
};

export default Home;
