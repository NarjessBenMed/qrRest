import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import openSocket from "socket.io-client";
import moment from "moment";

import "./WorkerSection.css";
import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
import { getAllOrders, checkoutOrder } from "../../features/orderSlice";
import { getTables } from "../../features/tableSlice";

const WorkerSection = () => {
  const [filterBy, setFilterBy] = useState("");
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    let socket = openSocket("http://localhost:5000/restaurant-space", {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log(socket.id);
    });
    if (user) {
      socket.emit("joinRoom", { restId: user.restaurantId });
      console.log("restid", user.restaurantId);
    }
    socket.on("hi", (data) => {
      console.log("from server", data);
    });
    socket.on("message", (data) => {
      console.log("new order------------", data);

      dispatch(getAllOrders(user.restaurantId));
    });
    return () => {
      socket.disconnect();
    };
  }, [user]);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getTables(user.restaurantId));
      dispatch(getAllOrders(user.restaurantId));
    }
  }, [isAuthenticated]);
  const { listTable, tableStatus } = useSelector((state) => state.table);
  useEffect(() => {
    if (listTable) setFilterBy(listTable[0].tableNumber);
  }, [listTable]);
  const { orders, orderStatus } = useSelector((state) => state.order);

  const handleChange = (e) => {
    setFilterBy(e.target.value);
  };
  const handleClick = (id) => {
    dispatch(checkoutOrder({ orderId: id }));
    dispatch(getAllOrders(user.restaurantId));
  };
  return (
    <div className="worker">
      <h2>List of orders</h2>
      <div className="worker__tables">
        <p>Select Your Table</p>
        {tableStatus.getAll === "loading" ? (
          <IconContext.Provider value={{ className: "spinner" }}>
            <div>
              <ImSpinner9 />
            </div>
          </IconContext.Provider>
        ) : tableStatus.getAll === "succeded" ? (
          <select name="filterBy" onChange={handleChange}>
            {listTable &&
              listTable.map((tab, i) => (
                <option key={tab._id} defaultValue value={tab.tableNumber}>
                  table {tab.tableNumber}
                </option>
              ))}
          </select>
        ) : (
          <h5>Something went wrong..</h5>
        )}
      </div>
      <div className="worker__content">
        {orderStatus.getAll === "loading" ? (
          <IconContext.Provider value={{ className: "spinner--large" }}>
            <div>
              <ImSpinner9 />
            </div>
          </IconContext.Provider>
        ) : orderStatus.getAll === "succeded" ? (
          orders &&
          orders
            // .filter((order) => !order.paid && order.tableNumber === filterBy)
            .filter((order) => {
              if (!order.paid && order.tableNumber === Number(filterBy))
                return order;
            })
            .map((order) => (
              <div className="worker__orders" key={order._id}>
                {order.items.map((item) => (
                  <div className="worker__orders__items" key={item._id}>
                    <div className="worker__orders__items__info">
                      <p>{item.name}</p>
                      <p>{item.quantity}</p>
                    </div>
                    {item.comment && (
                      <p className="comment">
                        <span>preferences: </span>
                        {item.comment}
                      </p>
                    )}

                    <span className="timeline">
                      {moment(item.createdAt).fromNow()}
                    </span>
                  </div>
                ))}
                <button onClick={() => handleClick(order._id)}>
                  Checkout order
                </button>
              </div>
            ))
        ) : (
          <h5>something went wrong..</h5>
        )}
      </div>
    </div>
  );
};

export default WorkerSection;
