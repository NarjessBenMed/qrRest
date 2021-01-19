import React, { useState, useEffect } from "react";
import "./ClientMenuItem.css";
const moment = require("moment");

const ClientMenuItem = ({ item, addToCommand }) => {
  const [food, setFood] = useState({
    price: 0,
    quantity: 0,
  });
  const { price, quantity } = food;
  useEffect(() => {
    let createdAt = moment().format();
    addToCommand(item.name, quantity, price, createdAt);
  }, [price]);
  const handleAdd = (itemPrice) => {
    setFood({
      ...food,
      quantity: Number(quantity) + 1,
      price: Number(price) + Number(itemPrice),
    });
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
        <button onClick={() => handleRemove(item.price)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => handleAdd(item.price)}>+</button>
      </div>
    </div>
  );
};

export default ClientMenuItem;
