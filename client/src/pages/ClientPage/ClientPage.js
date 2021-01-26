import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import openSocket from "socket.io-client";
import { Route, Switch } from "react-router-dom";
import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
import ClientMenu from "../../Components/ClientMenu/ClientMenu";
import MyOrder from "../MyOrder/MyOrder";
import { getMenuByRest } from "../../features/menuSlice";
import "./ClientPage.css";

const ClientPage = () => {
  const dispatch = useDispatch();
  const restId = localStorage.getItem("restId");
  useEffect(() => {
    dispatch(getMenuByRest(restId));
  }, []);
  useEffect(() => {
    let socket = openSocket("http://localhost:5000/restaurant-space", {
      transports: ["websocket", "polling"],
    });
    socket.on("connect", () => {
      console.log(socket.id);
    });
    if (restId) socket.emit("joinRoom", { restId });
    socket.on("newMenu", (data) => {
      console.log("newmenu", data);
      dispatch(getMenuByRest(restId));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const { menu, menuStatus } = useSelector((state) => state.menu);
  const clientMenu =
    menuStatus.getMenu === "loading" ? (
      <IconContext.Provider value={{ className: "spinner--large" }}>
        <div>
          <ImSpinner9 />
        </div>
      </IconContext.Provider>
    ) : menuStatus.getMenu === "succeded" && menu ? (
      menu.menu.items.length === 0 ? (
        <p> Ce menu n'est pas encore disponible</p>
      ) : (
        <ClientMenu menu={menu} restaurantId={restId} />
      )
    ) : (
      <h5>Something went wrong...</h5>
    );

  return (
    <div className="client-section">
      <Switch>
        <Route exact path="/client-page">
          <div className="client-section__info">
            <h2>Menu</h2>

            <img src={"/" + (menu && menu.menu.restaurant.logo)} alt="logo" />
            <h2>{menu && menu.menu.restaurant.name}</h2>
          </div>
          {clientMenu}
        </Route>
        <Route exact path="/client-page/order">
          <MyOrder />
        </Route>
      </Switch>
    </div>
  );
};

export default ClientPage;
