import React, { useState } from "react";
import { Link } from "react-router-dom";
import { deleteRestaurant, editRestaurant } from "../../features/ownerSlice";
import { useDispatch, useSelector } from "react-redux";
import { generateBase64FromImage } from "../../utils/image";
import "./RestaurantList.css";

const RestaurantList = ({ restaurants }) => {
  const [values, setValues] = useState({
    name: "",
    image: "",
    preview: "",
    address: "",
    edit: false,
  });
  const { name, image, preview, address, edit } = values;
  const dispatch = useDispatch();
  const { status, errors } = useSelector((state) => state.owner);
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
      setValues({ ...values, edit: false, preview: null });
    }
  };

  return (
    <div className="restlist">
      <h3>List fo Restaurants</h3>
      {restaurants && restaurants.length > 0 ? (
        restaurants.map((rest) => (
          <div className="restlist__item" key={rest._id}>
            <div className="restlist__item__form">
              <div className="restlist__item__form__group">
                <h5>The restaurant</h5>
                <span>
                  {errors &&
                    errors.data.filter((err) => err.param === "nameedit")[0] &&
                    errors.data.filter((err) => err.param === "nameedit")[0]
                      .msg}
                </span>
                {edit ? (
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleData}
                  />
                ) : (
                  <p>{rest.name}</p>
                )}
              </div>
              <div className="restlist__item__form__group">
                <h5>The Address</h5>
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
                {preview && (
                  <img className="image-prev" src={preview} alt=" " />
                )}
              </div>
              <div className="restlist__item__form__button">
                <button onClick={() => handleDelete(rest._id)}>Delete</button>
                <button onClick={() => handleEdit(rest)}>Edit</button>
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
                  <p>Menu</p>
                </Link>
                <Link
                  to={{
                    pathname: "/owner-section/staff",
                    state: {
                      restId: rest._id,
                    },
                  }}
                >
                  <p>Staff</p>
                </Link>
                <Link
                  to={{
                    pathname: "/owner-section/orders",
                    state: {
                      restId: rest._id,
                    },
                  }}
                >
                  <p>Orders</p>
                </Link>
                <Link
                  to={{
                    pathname: "/owner-section/tables",
                    state: {
                      restId: rest._id,
                    },
                  }}
                >
                  <p>Tables</p>
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h5>you have no restaurants</h5>
      )}
    </div>
  );
};

export default RestaurantList;
