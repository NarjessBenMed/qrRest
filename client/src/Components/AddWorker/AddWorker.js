import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
import { createWorker } from "../../features/staffSlice";
import "./AddWorker.css";

const AddWorker = ({ restId }) => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const { username, password } = values;
  const { workerStatus, workerErrors } = useSelector((state) => state.staff);
  useEffect(() => {
    if (workerStatus.create === "succeded")
      setValues({ username: "", password: "" });
  }, [workerStatus]);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createWorker({ username, password, restaurantId: restId }));
  };

  return (
    <div className="add-worker">
      <h3>Ajouter un nouveau personnel</h3>
      <form>
        <div className="add-worker__form__group">
          <h5>login </h5>
          <span>
            {workerStatus.create === "failed" &&
              workerErrors.create &&
              workerErrors.create.data.filter(
                (err) => err.param === "username"
              )[0] &&
              workerErrors.create.data.filter(
                (err) => err.param === "username"
              )[0].msg}
          </span>
          <input
            type="text"
            className="add-worker__container__form__input"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </div>
        <div className="add-worker__form__group">
          <h5>Mot de passe</h5>
          <span>
            {workerStatus.create === "failed" &&
              workerErrors.create &&
              workerErrors.create.data.filter(
                (err) => err.param === "password"
              )[0] &&
              workerErrors.create.data.filter(
                (err) => err.param === "password"
              )[0].msg}
          </span>
          <input
            type="password"
            className="add-worker__container__form__input"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="add-worker__addButton"
          onClick={handleSubmit}
        >
          {workerStatus.create === "loading" ? (
            <IconContext.Provider value={{ className: "spinner" }}>
              <div>
                <ImSpinner9 />
              </div>
            </IconContext.Provider>
          ) : (
            <span>ajouter</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddWorker;
