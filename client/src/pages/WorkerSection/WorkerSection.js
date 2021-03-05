import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import openSocket from "socket.io-client";
import moment from "moment";

import "./WorkerSection.css";
import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
import {
  getAllOrders,
  checkoutOrder,
  confirmCancelOrder,
  refuseCancelOrder,
  confirmEditPreOrder,
} from "../../features/orderSlice";
import { getTables } from "../../features/tableSlice";
const socketURL =
  process.env.NODE_ENV === "production"
    ? window.location.hostname
    : "http://localhost:5000";

const WorkerSection = () => {
  const [filterBy, setFilterBy] = useState("");
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    let socket = openSocket(`${socketURL}/restaurant-space`, {
      transports: ["websocket", "polling"],
      // secure: true,
    });

    socket.on("connect", () => {
      console.log(socket.id);
    });
    if (user) {
      socket.emit("joinRoom", { restId: user.restaurantId });
      console.log("restid", user.restaurantId);
    }
    socket.on("message", (data) => {
      console.log("new order------------", data);
      dispatch(getAllOrders(user.restaurantId));
    });
    // return () => {
    //   socket.disconnect();
    // };
  }, [user]);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getTables(user.restaurantId));
      dispatch(getAllOrders(user.restaurantId));
    }
  }, [isAuthenticated]);
  const { listTable, tableStatus } = useSelector((state) => state.table);
  useEffect(() => {
    if (listTable && listTable.length > 0)
      setFilterBy(listTable[0].tableNumber);
  }, [listTable]);
  const { orders, orderStatus } = useSelector((state) => state.order);

  const handleChange = (e) => {
    setFilterBy(e.target.value);
  };
  const handleClick = async (id) => {
    await dispatch(checkoutOrder({ orderId: id }));
    await dispatch(getAllOrders(user.restaurantId));
  };
  const handleConfirm = (itemId, orderId) => {
    dispatch(confirmCancelOrder({ itemId, orderId }));
  };
  const handleConfirmEdit = (itemId, orderId) => {
    dispatch(confirmEditPreOrder({ itemId, orderId }));
  };
  const handleRefuse = (itemId, orderId) => {
    dispatch(refuseCancelOrder({ itemId, orderId }));
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
            {listTable && listTable.length > 0 ? (
              listTable.map((tab, i) => (
                <option key={tab._id} defaultValue value={tab.tableNumber}>
                  table {tab.tableNumber}
                </option>
              ))
            ) : (
              <option>no table</option>
            )}
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
            .filter((order) => {
              if (!order.paid && order.tableNumber === Number(filterBy))
                return order;
            })
            .slice(0)
            .reverse()
            .map((order) => {
              return (
                <div className="worker__orders" key={order._id}>
                  {order.items
                    .slice(0)
                    .reverse()
                    .map((item) => (
                      <div
                        className="worker__orders__items"
                        key={item._id}
                        style={{ background: item.confirmed ? "white" : "red" }}
                      >
                        <div className="worker__orders__items__info">
                          <p>{item.name}</p>

                          {!item.confirmed && (
                            <Fragment>
                              <p>
                                waiting for
                                {
                                  order.preOrder.filter(
                                    (el) => el.itemId === item._id
                                  )[0].requestedAction
                                }
                                confirmation
                              </p>
                              <button
                                onClick={() =>
                                  handleConfirm(item._id, order._id)
                                }
                                style={{ width: 100, background: "green" }}
                              >
                                confirm
                              </button>
                              <button
                                onClick={() =>
                                  handleRefuse(item._id, order._id)
                                }
                                style={{ width: 100, background: "green" }}
                              >
                                refuse
                              </button>
                              <button
                                onClick={() =>
                                  handleConfirmEdit(item._id, order._id)
                                }
                                style={{ width: 100, background: "blue" }}
                              >
                                confirmedit
                              </button>
                            </Fragment>
                          )}

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
              );
            })
        ) : (
          <h5>something went wrong..</h5>
        )}
      </div>
    </div>
  );
};

export default WorkerSection;
