import React, { useEffect } from "react";
import AddMenu from "../../Components/AddMenu/AddMenu";
import Menu from "../Menu/Menu";
import { getMenuByRest } from "../../features/menuSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import openSocket from "socket.io-client";

import "./MyRestaurant.css";

const MyRestaurant = () => {
  const location = useLocation();
  const { restId, logo } = location.state;
  const dispatch = useDispatch();
  const { menu } = useSelector((state) => state.menu);
  useEffect(() => {
    dispatch(getMenuByRest(restId));
  }, [restId]);
  useEffect(() => {
    let socket = openSocket("http://localhost:5000/restaurant-space", {
      transports: ["websocket", "polling"],
    });
    socket.on("connect", () => {
      console.log(socket.id);
      socket.emit("joinRoom", { restId });
    });
    socket.on("newMenu", (data) => {
      dispatch(getMenuByRest(restId));
    });

    return () => {
      socket.disconnect();
    };
  }, [restId]);
  return (
    <div className="my-rest">
      <AddMenu />
      <Menu menu={menu} logo={logo} />
    </div>
  );
};

export default MyRestaurant;
