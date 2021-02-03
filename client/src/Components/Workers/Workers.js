import React from "react";
import { useDispatch } from "react-redux";

import { deleteWorker } from "../../features/staffSlice";
import "./Workers.css";

const Workers = ({ list }) => {
  const dispatch = useDispatch();
  const handleClick = (id) => {
    dispatch(deleteWorker({ id }));
  };
  return (
    <div className="workerlist">
      <h3>Liste des personnels</h3>
      {list &&
        list.length > 0 &&
        list.map((worker) => (
          <div className="workerlist__item" key={worker._id}>
            <div className="workerlist__item__info">
              <h4>Login :</h4>
              <span>{worker.username}</span>
            </div>
            <button
              onClick={() => handleClick(worker._id)}
              className="worker__btn"
            >
              Supprimer
            </button>
          </div>
        ))}
    </div>
  );
};

export default Workers;
