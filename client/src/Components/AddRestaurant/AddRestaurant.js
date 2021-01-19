import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
import { createRestaurant } from "../../features/ownerSlice";
import { generateBase64FromImage } from "../../utils/image";
import "./AddRestaurant.css";

const AddRestaurant = () => {
  const [values, setValues] = useState({
    name: "",
    address: "",
    logo: "",
    preview: "",
  });
  const { name, logo, address, preview } = values;
  const dispatch = useDispatch();
  const { status, errors } = useSelector((state) => state.owner);
  useEffect(() => {
    if (status === "succeded")
      setValues({ name: "", address: "", logo: "", preview: "" });
  }, [status]);
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file)
      generateBase64FromImage(file)
        .then((b64) => {
          setValues({ ...values, logo: file, preview: b64 });
        })
        .catch((e) => {
          setValues({ ...values, preview: null });
        });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("image", logo);
    dispatch(createRestaurant(formData));
  };
  return (
    <div className="addrestau">
      <h3>Create new Restaurant</h3>
      <form>
        <div className="addrestau__form__group">
          <h5>Restaurant's name</h5>
          <span>
            {errors &&
              errors.data.filter((err) => err.param === "name")[0] &&
              errors.data.filter((err) => err.param === "name")[0].msg}
          </span>

          <input
            type="text"
            className="addrestau__container__form__input valid__input"
            name="name"
            value={name}
            onChange={handleChange}
          />
        </div>

        <div className="addrestau__form__group">
          <h5>address</h5>
          <span>
            {errors &&
              errors.data.filter((err) => err.param === "address")[0] &&
              errors.data.filter((err) => err.param === "address")[0].msg}
          </span>

          <input
            type="text"
            className="addrestau__container__form__input valid__input"
            name="address"
            value={address}
            onChange={handleChange}
          />
        </div>
        <div className="addrestau__form__group">
          <h5>logo</h5>
          <span>
            {errors &&
              errors.data.filter((err) => err.param === "logo")[0] &&
              errors.data.filter((err) => err.param === "logo")[0].msg}
          </span>

          <input
            type="file"
            className="addrestau__container__form__input valid__input"
            name="logo"
            onChange={fileHandler}
          />
          {preview && <img className="logo-preview" src={preview} alt="d" />}
        </div>

        <button
          type="submit"
          className="addrestau__addrestauButton"
          onClick={handleSubmit}
        >
          {status === "loading" ? (
            <IconContext.Provider value={{ className: "spinner" }}>
              <div>
                <ImSpinner9 />
              </div>
            </IconContext.Provider>
          ) : (
            <span>Add</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddRestaurant;
