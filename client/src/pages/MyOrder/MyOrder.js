import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";

import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
import { getOrderById, cancelOrder } from "../../features/orderSlice";
import "./MyOrder.css";

const MyOrder = () => {
  const [editFields, setEditFields] = useState({
    editStatus: { toEdit: false, itemId: null, unitPrice: 0 },
    editOrder: null,
  });
  const { editStatus, editOrder } = editFields;
  const dispatch = useDispatch();
  const location = useLocation();
  const { orderId } = location.state;
  useEffect(() => {
    console.log("orederid", orderId);
    dispatch(getOrderById(orderId));
  }, [orderId]);
  const { order, orderStatus } = useSelector((state) => state.order);
  useEffect(() => {
    order.order.items &&
      setEditFields({ ...editFields, editOrder: order.order.items });
  }, [order]);
  const handleCancel = (itemId) => {
    dispatch(cancelOrder({ itemId, orderId }));
  };
  const handleEdit = (item) => {
    editStatus.toEdit
      ? setEditFields({
          ...editFields,
          editStatus: { toEdit: false, itemId: null },
        })
      : setEditFields({
          ...editFields,
          editStatus: {
            toEdit: true,
            itemId: item._id,
            unitPrice: Number(item.price) / Number(item.quantity),
          },
        });
  };
  const handleAdd = (id) => {
    let itemIndex = editOrder.findIndex((item) => item._id === id);
    let newList = [...editOrder];
    newList[itemIndex] = {
      ...newList[itemIndex],
      quantity: newList[itemIndex].quantity + 1,
      price: Number(newList[itemIndex].price) + Number(editStatus.unitPrice),
    };
    setEditFields({ ...editFields, editOrder: newList });
  };
  const handleRemove = (id) => {
    let itemIndex = editOrder.findIndex((item) => item._id === id);
    let newList = [...editOrder];
    if (newList[itemIndex].quantity > 1) {
      newList[itemIndex] = {
        ...newList[itemIndex],
        quantity: newList[itemIndex].quantity - 1,
        price: Number(newList[itemIndex].price) - Number(editStatus.unitPrice),
      };
      setEditFields({ ...editFields, editOrder: newList });
    }
  };

  return (
    <div className="order">
      <h2>A Payer</h2>
      {orderStatus.getOne === "loading" ? (
        <IconContext.Provider value={{ className: "spinner--large" }}>
          <div>
            <ImSpinner9 />
          </div>
        </IconContext.Provider>
      ) : orderStatus.getOne === "succeded" ? (
        editOrder &&
        editOrder.map((item) => (
          <div className="order__item" key={item._id}>
            <p>{item.name}</p>
            <div className="order__item__info">
              <p>{item.quantity}</p>
              {editStatus.toEdit && item._id === editStatus.itemId && (
                <Fragment>
                  <button onClick={() => handleAdd(item._id)}>plus</button>
                  <button onClick={() => handleRemove(item._id)}>moins</button>
                </Fragment>
              )}
              <p>{item.price} DT</p>
              <p>{item.comment && item.comment}</p>
              <button onClick={() => handleCancel(item._id)}>annuler</button>
              <button onClick={() => handleEdit(item)}>modifier</button>
            </div>
          </div>
        ))
      ) : (
        <h5>somthing went wrong..</h5>
      )}
      <div className="order__item__total">
        <p>total</p>
        <p>
          {orderStatus.getOne === "loading" ? (
            <span>loading..</span>
          ) : orderStatus.getOne === "succeded" ? (
            order && order.order.total
          ) : null}
          DT
        </p>
      </div>
      <div className="client-menu__nav">
        <Link to="/client-page">
          <button className="client-menu__nav__back">retour au menu </button>
        </Link>
      </div>
    </div>
  );
};

export default MyOrder;
