import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
import { getOrderById } from "../../features/orderSlice";
import "./MyOrder.css";

const MyOrder = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { orderId } = location.state;
  useEffect(() => {
    console.log("orederid", orderId);
    dispatch(getOrderById(orderId));
  }, [orderId]);
  const { order, orderStatus } = useSelector((state) => state.order);
  return (
    <div className="order">
      <h1>A Payer</h1>
      {orderStatus.getOne === "loading" ? (
        <IconContext.Provider value={{ className: "spinner--large" }}>
          <div>
            <ImSpinner9 />
          </div>
        </IconContext.Provider>
      ) : orderStatus.getOne === "succeded" ? (
        order &&
        order.order.items.map((item) => (
          <div className="order__item" key={item._id}>
            <p>{item.name}</p>
            <div className="order__item__info">
              <p>{item.quantity}</p>
              <p>{item.price} DT</p>
            </div>
          </div>
        ))
      ) : (
        <h5>somthing went wrong..</h5>
      )}
      <div className="order__item__total">
        <p>total:</p>
        <p>
          {orderStatus.getOne === "loading" ? (
            <span>loading..</span>
          ) : orderStatus.getOne === "succeded" ? (
            order && order.order.total
          ) : null}
          DT
        </p>
      </div>
    </div>
  );
};

export default MyOrder;
