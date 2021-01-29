import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteRestaurant, editRestaurant } from "../../features/ownerSlice";
import { generateBase64FromImage } from "../../utils/image";
import { ImSpinner9 } from "react-icons/im";

import "./RestaurantListItem.css";
import { FaUsersCog } from "react-icons/fa";
import { IconContext } from "react-icons";

const RestaurantListIem = ({ rest }) => {
  const [values, setValues] = useState({
    name: "",
    image: "",
    preview: "",
    address: "",
    edit: false,
  });
  const { name, image, preview, address, edit } = values;
  const dispatch = useDispatch();
  const { ownerStatus, ownerErrors } = useSelector((state) => state.owner);
  useEffect(() => {
    if (ownerStatus.edit === "succeded")
      setValues({ ...values, edit: false, preview: null });
  }, [ownerStatus]);
  const handleDelete = (id) => {
    dispatch(deleteRestaurant({ restId: id }));
  };
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file)
      generateBase64FromImage(file)
        .then((b64) => {
          setValues({ ...values, image: file, preview: b64 });
        })
        .catch((e) => {
          setValues({ ...values, preview: null });
        });
  };
  const handleData = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleEdit = (rest) => {
    if (!edit) {
      setValues({
        name: rest.name,
        address: rest.address,
        edit: true,
      });
    } else {
      let formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("image", image);
      formData.append("restId", rest._id);
      formData.append("lastImg", rest.logo);
      dispatch(editRestaurant(formData));
    }
  };
  return (
    <div className="restlist__item">
      <div className="restlist__item__form">
        <div className="restlist__item__form__group">
          <h5>restaurant:</h5>
          <span className="error-message">
            {edit &&
              ownerStatus.edit === "failed" &&
              ownerErrors.edit.data.filter((err) => err.param === "name")[0] &&
              ownerErrors.edit.data.filter((err) => err.param === "name")[0]
                .msg}
          </span>
          {edit ? (
            <input type="text" name="name" value={name} onChange={handleData} />
          ) : (
            <p>{rest.name}</p>
          )}
        </div>
        <div className="restlist__item__form__group">
          <h5>Address:</h5>
          <span className="error-message">
            {edit &&
              ownerStatus.edit === "failed" &&
              ownerErrors.edit.data.filter(
                (err) => err.param === "address"
              )[0] &&
              ownerErrors.edit.data.filter((err) => err.param === "address")[0]
                .msg}
          </span>
          {edit ? (
            <input
              type="text"
              name="address"
              value={address}
              onChange={handleData}
            />
          ) : (
            <p>{rest.address}</p>
          )}
        </div>
        <div className="restlist__item__form__group">
          <h5>Logo</h5>

          {edit ? (
            <input type="file" name="image" onChange={handleFile} />
          ) : (
            <img className="image-prev" src={rest.logo} alt="" />
          )}
          {preview && <img className="image-prev" src={preview} alt=" " />}
        </div>
        <div className="restlist__item__form__button">
          <button onClick={() => handleDelete(rest._id)}>
            {edit && ownerStatus.delete === "loading" ? (
              <IconContext.Provider value={{ className: "spinner" }}>
                <div>
                  <ImSpinner9 />
                </div>
              </IconContext.Provider>
            ) : (
              <span>Delete</span>
            )}
          </button>
          <button onClick={() => handleEdit(rest)}>
            <span>Edit</span>
          </button>
        </div>
        <div className="restlist__item__form__links">
          <Link
            to={{
              pathname: "/owner-section/my-rest",
              state: {
                restId: rest._id,
                logo: rest.logo,
                restName: rest.name,
              },
            }}
          >
            <span>Menu</span>
          </Link>
          <Link
            to={{
              pathname: "/owner-section/staff",
              state: {
                restId: rest._id,
              },
            }}
          >
            <span>
              <div className="staff__bouton">
                <IconContext.Provider value={{ className: "staff-icon" }}>
                  <FaUsersCog />
                </IconContext.Provider>
                <span> Staff</span>
              </div>
            </span>
          </Link>
          <Link
            to={{
              pathname: "/owner-section/orders",
              state: {
                restId: rest._id,
              },
            }}
          >
            <span>Orders</span>
          </Link>
          <Link
            to={{
              pathname: "/owner-section/tables",
              state: {
                restId: rest._id,
              },
            }}
          >
            <span>Tables</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantListIem;
