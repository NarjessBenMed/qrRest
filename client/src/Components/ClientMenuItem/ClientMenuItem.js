import React, { useState, useEffect } from "react";
import "./ClientMenuItem.css";
const moment = require("moment");

const ClientMenuItem = ({ item, addToCommand }) => {
  const [showInput, setShowInput] = useState(false);
  const [food, setFood] = useState({
    price: 0,
    quantity: 0,
    comment: "",
  });
  const { price, quantity, comment } = food;
  useEffect(() => {
    let createdAt = moment().format();
    addToCommand(item.name, quantity, price, comment, createdAt);
  }, [price]);
  const handleAdd = (itemPrice) => {
    setFood({
      ...food,
      quantity: Number(quantity) + 1,
      price: Number(price) + Number(itemPrice),
    });
  };
  const handleComment = (e) => {
    setFood({ ...food, comment: e.target.value });
  };
  const handleShow = () => {
    setShowInput(!showInput);
  };
  const handleRemove = (itemPrice) => {
    if (quantity > 0)
      setFood({
        ...food,
        quantity: Number(quantity) - 1,
        price: Number(price) - Number(itemPrice),
      });
  };
  return (
    <div className="client-menu-item">
      <img src={item.image} alt="food" />
      <div className="client-menu-item__group">
        <p>{item.name}</p>
        <p>{item.price} dt</p>
      </div>

      <p className="client-menu-item__desc">{item.description}</p>

      <span className="client-menu-item__price">
        Total: {price > 0 ? price : 0}
      </span>

      <div className="client-menu-item__quantity">
        <button
          className="client-menu-item__button"
          onClick={() => handleRemove(item.price)}
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          className="client-menu-item__button"
          onClick={() => handleAdd(item.price)}
        >
          +
        </button>
      </div>
      <div className="client-menu-item__comment">
        {showInput && (
          <input type="text" value={comment} onChange={handleComment} />
        )}
        <button className="comment__button" onClick={handleShow}>
          ajouter un commentaire
        </button>
      </div>
    </div>
  );
};

export default ClientMenuItem;
