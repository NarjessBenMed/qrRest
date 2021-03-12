import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link, useHistory } from "react-router-dom";
import { IconContext } from "react-icons";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { CgEditExposure } from "react-icons/cg";
import { ImSpinner9 } from "react-icons/im";
import { HiOutlineMinusCircle, HiOutlinePlusCircle } from "react-icons/hi";

import {
  getOrderById,
  cancelOrder,
  editPreOrder,
} from "../../features/orderSlice";
import "./MyOrder.css";

const MyOrder = ({ channel }) => {
  const [editFields, setEditFields] = useState({
    editStatus: { toEdit: false, itemId: null, unitPrice: 0 },
    editOrder: null,
    oldQuantity: 0,
  });
  const { editStatus, editOrder, oldQuantity } = editFields;
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { orderId } = location.state;
  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [orderId]);
  useEffect(() => {
    if (channel) {
      channel.on("message", (data) => {
        dispatch(getOrderById(orderId));
      });
      channel.on("checkout", (data) => {
        history.push("/client-page");
      });
    }
  }, [channel]);

  const { order, orderStatus } = useSelector((state) => state.order);
  useEffect(() => {
    order.order.items &&
      setEditFields({ ...editFields, editOrder: order.order.items });
  }, [order]);
  const handleCancel = (itemId) => {
    dispatch(cancelOrder({ itemId, orderId }));
  };
  const handleEdit = (item) => {
    if (editStatus.toEdit) {
      const itemToEdit = editOrder.filter((el) => el._id === item._id)[0];

      const newValues = {
        newQuantity: itemToEdit.quantity,
        newPrice: itemToEdit.price,
        newComment: "",
      };

      if (Number(oldQuantity) !== Number(itemToEdit.quantity)) {
        dispatch(
          editPreOrder({ itemId: editStatus.itemId, orderId, newValues })
        );
      }
      setEditFields({
        ...editFields,
        editStatus: { toEdit: false, itemId: null },
      });
    } else {
      setEditFields({
        ...editFields,
        oldQuantity: item.quantity,
        editStatus: {
          toEdit: true,
          itemId: item._id,
          unitPrice: Number(item.price) / Number(item.quantity),
        },
      });
    }
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

  const requestResult = (item) => {
    const preOrder = order.order.preOrder;
    if (
      preOrder.length > 0 &&
      preOrder.filter((order) => order.itemId === item._id)[0]
    ) {
      if (item.confirmed) {
        if (preOrder.filter((order) => order.itemId === item._id)[0].confirmed)
          return (
            <p className="request__msg--valid">
              {/* {
                preOrder.filter((order) => order.itemId === item._id)[0]
                  .requestedAction
              } */}
              votre demande est validée
            </p>
          );
        else
          return (
            <p className="request__msg--rejected">
              {/* {
                preOrder.filter((order) => order.itemId === item._id)[0]
                  .requestedAction
              } */}
              votre demande est rejetée
            </p>
          );
      } else {
        return (
          <p className="request__msg--waiting">
            en attente de
            {/* {preOrder.length > 0 &&
              preOrder.filter((order) => order.itemId === item._id)[0]
                .requestedAction} */}
            confirmation
          </p>
        );
      }
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
        editOrder.length > 0 &&
        editOrder.map((item) => (
          <div className="order__item" key={item._id}>
            <div className="order__item__head">
              <p>{item.name}</p>
              <div className="order__item__info">
                <p>{item.quantity}</p>
                <p>{item.price} DT</p>
              </div>
            </div>
            <div className="order__item__foot">
              <span className="order__item__foot__result">
                {requestResult(item)}
              </span>
              <div>
                {editStatus.toEdit && item._id === editStatus.itemId && (
                  <Fragment>
                    <button
                      className="order__req__but"
                      onClick={() => handleAdd(item._id)}
                    >
                      <span>
                        <IconContext.Provider
                          value={{
                            className: "order-icon--valid",
                          }}
                        >
                          <HiOutlinePlusCircle />
                        </IconContext.Provider>
                      </span>
                    </button>
                    <button
                      className="order__req__but"
                      onClick={() => handleRemove(item._id)}
                    >
                      <span>
                        <div>
                          <IconContext.Provider
                            value={{
                              className: "order-icon--delete",
                            }}
                          >
                            <HiOutlineMinusCircle />
                          </IconContext.Provider>
                        </div>
                      </span>
                    </button>
                  </Fragment>
                )}

                <button
                  className="order__req__but"
                  onClick={() => handleCancel(item._id)}
                >
                  <span>
                    <div>
                      <IconContext.Provider
                        value={{
                          className: "order-icon--delete",
                        }}
                      >
                        <RiDeleteBin5Fill />
                      </IconContext.Provider>
                    </div>
                  </span>
                </button>
                <button
                  className="order__req__but"
                  onClick={() => handleEdit(item)}
                >
                  <span>
                    <div>
                      <IconContext.Provider
                        value={{
                          className: "order-icon--valid",
                        }}
                      >
                        <CgEditExposure />
                      </IconContext.Provider>
                    </div>
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h5>un probléme est survenu..</h5>
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
