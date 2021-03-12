import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import openSocket from "socket.io-client";
import moment from "moment";
import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
import "./WorkerSection.css";

import {
  getAllOrders,
  checkoutOrder,
  confirmCancelOrder,
  refuseCancelOrder,
  confirmEditPreOrder,
} from "../../features/orderSlice";
import { getTables } from "../../features/tableSlice";

import "moment/locale/fr";
moment.locale("fr");

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
        <p> Selectionnez une table </p>
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
              <option>aucune table trouvé</option>
            )}
          </select>
        ) : (
          <h5>un probléme est survenue .. veuillez réessayer </h5>
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
                      <div className="worker__orders__items" key={item._id}>
                        <div className="worker__orders__items__info">
                          <div className="req__info">
                            <p>{item.name}</p>
                            <p> quantité :{item.quantity}</p>
                            {/* {order.preOrder.filter(
                              (el) => el.itemId === item._id
                            )[0].newQuantity && ( */}
                          </div>
                          <div className="req__info">
                            {!item.confirmed && (
                              <Fragment>
                                <p className="req__dmd">
                                  demande
                                  {order.preOrder.filter(
                                    (el) => el.itemId === item._id
                                  )[0].requestedAction === "cancel" ? (
                                    <span> d'annulation </span>
                                  ) : (
                                    <p>
                                      de modification du quantité
                                      <span>
                                        (nouvelle quantité :
                                        {order.preOrder.length > 0 &&
                                          order.preOrder.filter(
                                            (el) => el.itemId === item._id
                                          )[0].newQuantity}
                                        )
                                      </span>
                                    </p>
                                  )}
                                </p>
                                <div className="butt__response">
                                  {order.preOrder.filter(
                                    (el) => el.itemId === item._id
                                  )[0].requestedAction === "cancel" && (
                                    <button
                                      className="button__req__valid"
                                      onClick={() =>
                                        handleConfirm(item._id, order._id)
                                      }
                                    >
                                      valider
                                    </button>
                                  )}
                                  <button
                                    className="button__req__reject"
                                    onClick={() =>
                                      handleRefuse(item._id, order._id)
                                    }
                                  >
                                    refuser
                                  </button>
                                  {order.preOrder.filter(
                                    (el) => el.itemId === item._id
                                  )[0].requestedAction === "edit" && (
                                    <button
                                      className="button__req__valid"
                                      onClick={() =>
                                        handleConfirmEdit(item._id, order._id)
                                      }
                                    >
                                      confirmer
                                    </button>
                                  )}
                                </div>
                              </Fragment>
                            )}
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
                      </div>
                    ))}
                  <p>Total : {order.total}</p>
                  <button
                    className="butt-pay"
                    onClick={() => handleClick(order._id)}
                  >
                    Confirmer le paiement
                  </button>
                </div>
              );
            })
        ) : (
          <h5>un probléme est survenu..</h5>
        )}
      </div>
    </div>
  );
};

export default WorkerSection;
