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
      <h3>List of Workers</h3>
      {list &&
        list.length > 0 &&
        list.map((worker) => (
          <div className="workerlist__item" key={worker._id}>
            <h5>The Worker :</h5>
            <span>{worker.username}</span>
            <button
              onClick={() => handleClick(worker._id)}
              className="worker__btn"
            >
              delete
            </button>
          </div>
        ))}
    </div>
  );
};

export default Workers;
