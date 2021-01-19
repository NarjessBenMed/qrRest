import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getAllOrders } from "../../features/orderSlice";
import openSocket from "socket.io-client";
import "./OrderList.css";
import moment from "moment";

const OrderList = () => {
  const [paid, setPaid] = useState(false);
  const [filterDate, setFilterDate] = useState({
    today: moment().format(),
    filterByDate: false,
  });
  const { today, filterByDate } = filterDate;
  const location = useLocation();
  const { restId } = location.state;
  const dispatch = useDispatch();
  useEffect(() => {
    let socket = openSocket("http://localhost:5000/restaurant-space", {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log(socket.id);
    });
    if (restId) {
      socket.emit("joinRoom", { restId: restId });
      console.log("restid", restId);
    }
    socket.on("hi", (data) => {
      console.log("from server", data);
    });
    socket.on("message", (data) => {
      console.log("new order------------", data);

      dispatch(getAllOrders(restId));
    });
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
  useEffect(() => {
    dispatch(getAllOrders(restId));
  }, []);
  const { orders, status } = useSelector((state) => state.order);
  const handleFilter = (filterBy) => {
    setPaid(filterBy);
  };
  const handleDate = () => {
    setFilterDate({ ...filterDate, filterByDate: !filterByDate });
  };

  return (
    <div className="orders">
      <h2>List of Orders</h2>
      <div className="orders__buttons">
        <button
          className={
            !paid ? "orders__buttons--active" : "orders__buttons--normal"
          }
          onClick={() => handleFilter(false)}
        >
          Non Payé
        </button>
        <button
          className={
            paid ? "orders__buttons--active" : "orders__buttons--normal"
          }
          onClick={() => handleFilter(true)}
        >
          Payé
        </button>
        <button
          className={
            filterByDate ? "orders__buttons--active" : "orders__buttons--normal"
          }
          onClick={handleDate}
        >
          Today's orders
        </button>
      </div>

      {status === "succeded" &&
        orders &&
        orders
          .filter(
            (order) =>
              order.paid === paid &&
              (filterByDate
                ? moment(order.createdAt).isSame(today, "day")
                : moment(order.createdAt).isBefore(today, "day"))
          )
          .map((order) => (
            <div className="orders__items" key={order._id}>
              <p>Table {order.tableNumber}</p>
              {order.items.map((item) => (
                <div className="orders__items__single" key={item._id}>
                  <div className="orders__items__info">
                    <p>{item.name}</p>
                    <p>{item.quantity}</p>
                  </div>
                  <p className="orders__items__time">
                    {moment(item.createdAt).fromNow()}
                  </p>
                </div>
              ))}
              <p>Total : {order.total}</p>
            </div>
          ))}
    </div>
  );
};

export default OrderList;
