import React, { useEffect, useState } from "react";
import openSocket from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { getRestList } from "../../features/ownerSlice";
import AddRestaurant from "../../Components/AddRestaurant/AddRestaurant";
import RestaurantList from "../../Components/RestaurantList/RestaurantList";
import AddMenu from "../../Components/AddMenu/AddMenu";
import TableList from "../../Components/TableList/TableList";
import StaffList from "../../Components/StaffList/StaffList";
import OrderList from "../../Components/OrderList/OrderList";

import Menu from "../Menu/Menu";
import "./OwnerSection.css";
import { Route, Switch } from "react-router-dom";
import MyRestaurant from "../MyRestaurant/MyRestaurant";
const socketURL =
  process.env.NODE_ENV === "production"
    ? window.location.hostname
    : "http://localhost:5000";

const OwnerSection = () => {
  const [channel, setChannel] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getRestList());
    }
  }, [isAuthenticated]);
  useEffect(() => {
    let socket = openSocket(`${socketURL}/owner-space`, {
      transports: ["websocket", "polling"],
      // secure: true,
    });
    setChannel(socket);
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("restaurants", (data) => {
      console.log("from server", data.action);
      dispatch(getRestList());
    });
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const { restList } = useSelector((state) => state.owner);
  return (
    <div className="owner">
      <Switch>
        <Route exact path="/owner-section">
          <AddRestaurant />
          <RestaurantList restaurants={restList} />
        </Route>
        <Route exact path="/owner-section/menu">
          <AddMenu />
        </Route>
        <Route exact path="/owner-section/rest-menu">
          <Menu />
        </Route>
        <Route exact path="/owner-section/my-rest">
          <MyRestaurant />
        </Route>
        <Route exact path="/owner-section/tables">
          <TableList channel={channel} />
        </Route>
        <Route exact path="/owner-section/staff">
          <StaffList channel={channel} />
        </Route>
        <Route exact path="/owner-section/orders">
          <OrderList />
        </Route>
      </Switch>
    </div>
  );
};

export default OwnerSection;
