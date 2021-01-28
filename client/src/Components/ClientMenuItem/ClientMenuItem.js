import React, { useState, useEffect } from "react";
import "./ClientMenuItem.css";
import moment from "moment";

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
      <div className="client-menu-item__group">
        <img src={item.image} alt="food" />
        <div className="client-menu-item__info">
          <p>{item.name}</p>
          <p>{item.price} dt</p>
          <span className="client-menu-item__price">
            Total: {price > 0 ? price : 0}
          </span>
        </div>
      </div>

      <p className="client-menu-item__desc">{item.description}</p>

      <div className="client-menu-item__buttons">
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
        {quantity > 0 ? (
          <button className="comment__button" onClick={handleShow}>
            ajouter un commentaire
          </button>
        ) : (
          <button className="comment__button" onClick={handleShow} disabled>
            ajouter un commentaire
          </button>
        )}

        {showInput && quantity > 0 && (
          <textarea value={comment} onChange={handleComment} rows="3" cols="20">
            commentaire..
          </textarea>
        )}
      </div>
    </div>
  );
};

export default ClientMenuItem;
