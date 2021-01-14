import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../features/authSlice";
import { useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const isClient = useSelector((state) => state.auth.isClient);
  const user = useSelector((state) => state.auth.user);
  const handleLog = () => {
    dispatch(logout());
  };

  const adminMenu = (
    <Fragment>
      <Link to="/admin-section">
        <span className="navbar__nav__link active">Home</span>
      </Link>
      <Link to="/">
        <span className="navbar__nav__link" onClick={handleLog}>
          Déconnexion
        </span>
      </Link>
    </Fragment>
  );
  const ownerMenu = (
    <Fragment>
      <Link to="/owner-section">
        <span className="navbar__nav__link">Home</span>
      </Link>
      <Link to="/">
        <span className="navbar__nav__link" onClick={handleLog}>
          Déconnexion
        </span>
      </Link>
    </Fragment>
  );
  const homeMenu = (
    <Fragment>
      <Link to="/">
        <span className="navbar__nav__link">Home</span>
      </Link>
      <Link to="/">
        <span className="navbar__nav__link">Le fonctionnement</span>
      </Link>
      <Link to="/">
        <span className="navbar__nav__link">Les avantages</span>
      </Link>
      <Link to="/">
        <span className="navbar__nav__link">Les adhérents</span>
      </Link>
      <Link to="/">
        <span className="navbar__nav__link">Nous contacter</span>
      </Link>
      <Link to="/signin">
        <span className="navbar__nav__link">se connecter</span>
      </Link>
    </Fragment>
  );
  const clientMenu = (
    <Fragment>
      <Link to="/client-page">
        <span className="navbar__nav__link">Menu</span>
      </Link>
      <Link to="/">
        <span className="navbar__nav__link">Deconnexion</span>
      </Link>
    </Fragment>
  );
  const workerMenu = (
    <Fragment>
      <Link to="/worker-section">
        <span className="navbar__nav__link active">Home</span>
      </Link>
      <Link to="/">
        <span className="navbar__nav__link" onClick={handleLog}>
          Déconnexion
        </span>
      </Link>
    </Fragment>
  );
  const navMenu = isAuth
    ? user.role === "owner"
      ? ownerMenu
      : user.role === "admin"
      ? adminMenu
      : workerMenu
    : isClient
    ? clientMenu
    : homeMenu;

  return (
    <div className={location.pathname !== "/" ? "navbar bg-dark" : "navbar"}>
      {navMenu}
    </div>
  );
};

export default Navbar;
