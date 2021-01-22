import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
import { addToMenu } from "../../features/ownerSlice";
import openSocket from "socket.io-client";
import { generateBase64FromImage } from "../../utils/image";
import "./AddMenu.css";

const AddMenu = (props) => {
  const ref = React.useRef();
  const clearImag = () => {
    ref.current.value = "";
  };
  const [values, setValues] = useState({
    name: "",
    price: "",
    image: "",
    preview: "",
    description: "",
    categorie: "entree",
  });
  const location = useLocation();
  const { restId, logo, restName } = location.state;
  useEffect(() => {
    let socket = openSocket("http://localhost:5000/restaurant-space", {
      transports: ["websocket", "polling"],
    });
    socket.on("connect", () => {});
    if (restId) {
      console.log("restid", restId);
      socket.emit("joinRoom", { restId });
    }

    socket.on("hi", (data) => {
      console.log("from server", data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const { name, price, image, description, categorie, preview } = values;
  const dispatch = useDispatch();
  useEffect(() => {}, [dispatch]);
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const { status } = useSelector((state) => state.owner);
  const fileHandler = (e) => {
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
  const handleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("restaurant", restId);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image);
    formData.append("description", description);
    formData.append("categorie", categorie);

    dispatch(addToMenu(formData));
    setValues({
      name: "",
      price: "",
      image: "",
      preview: "",
      description: "",
      categorie: "entree",
    });
    clearImag();
  };
  return (
    <div className="menu-add">
      <div className="menu__info">
        <h2>Create Menu </h2>
        <h2>{restName}</h2>
        {/* <img src={'/' + logo} alt='logo' /> */}
      </div>
      <form className="menu-add__form">
        <div className="menu__form__group">
          <h5> name de plat </h5>

          <input
            type="text"
            className="menu__container__form__input valid__input"
            name="name"
            value={name}
            onChange={handleChange}
          />
        </div>

        <div className="menu__form__group">
          <h5>description</h5>

          <input
            type="text"
            className="menu__container__form__input valid__input"
            name="description"
            value={description}
            onChange={handleChange}
          />
        </div>

        <div className="menu__form__group">
          <h5>price</h5>

          <input
            type="text"
            className="menu__container__form__input valid__input"
            name="price"
            value={price}
            onChange={handleChange}
          />
        </div>

        <div className="menu__form__group-select">
          <h5>categorie</h5>
          <select name="categorie" value={categorie} onChange={handleChange}>
            <option key="entree" value="entree">
              Entree
            </option>
            <option key="boisson" value="boisson">
              Boisson
            </option>
            <option key="plat" value="plat">
              plat
            </option>
            <option key="Dessert" value="Dessert">
              Dessert{" "}
            </option>
          </select>
        </div>
        <div className="menu__form__group">
          <h5>photo du plat </h5>

          <input
            ref={ref}
            type="file"
            className="menu__form__file"
            name="image"
            onChange={fileHandler}
          />
          {preview && <img className="image-preview" src={preview} alt="d" />}
        </div>

        <button
          type="submit"
          className="menu__menuButton"
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

export default AddMenu;
