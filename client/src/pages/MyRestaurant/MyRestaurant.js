import React, { useEffect } from "react";
import AddMenu from "../../Components/AddMenu/AddMenu";
import Menu from "../Menu/Menu";
import { getMenuByRest } from "../../features/menuSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import openSocket from "socket.io-client";

import "./MyRestaurant.css";
import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
const socketURL =
  process.env.NODE_ENV === "production"
    ? window.location.hostname
    : "http://localhost:5000";

const MyRestaurant = () => {
  const location = useLocation();
  const { restId, logo } = location.state;
  const dispatch = useDispatch();
  const { menu, menuStatus, menuErrors } = useSelector((state) => state.menu);
  useEffect(() => {
    dispatch(getMenuByRest(restId));
  }, [restId]);
  useEffect(() => {
    let socket = openSocket(`${socketURL}/restaurant-space`, {
      transports: ["websocket", "polling"],
      // secure: true,
    });
    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("joinRoom", { restId });
    });
    socket.on("newMenu", (data) => {
      dispatch(getMenuByRest(restId));
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, [restId]);
  return (
    <div className="my-rest">
      <AddMenu />
      {menuStatus.getMenu === "loading" ? (
        <IconContext.Provider value={{ className: "spinner--large" }}>
          <div>
            <ImSpinner9 />
          </div>
        </IconContext.Provider>
      ) : menuStatus.getMenu === "failed" ? (
        <h4>un probléme est survenvenu, merci de réessayer </h4>
      ) : menuStatus.getMenu === "succeded" && menu.menu.items.length > 0 ? (
        <Menu menu={menu} logo={logo} />
      ) : (
        <h5>aucun menu n'est enregistré</h5>
      )}
    </div>
  );
};

export default MyRestaurant;
