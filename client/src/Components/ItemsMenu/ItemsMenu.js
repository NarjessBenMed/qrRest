import React, { useState } from "react";
import "./ItemsMenu.css";
import { deleteItemMenu, editItemMenu } from "../../features/menuSlice";
import { useDispatch, useSelector } from "react-redux";
import { generateBase64FromImage } from "../../utils/image";
import { MdDelete } from "react-icons/md";
import { IconContext } from "react-icons";
import { RiEdit2Fill } from "react-icons/ri";

const ItemsMenu = ({ item }) => {
  const [values, setValues] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    preview: "",
    edit: false,
  });
  const { name, price, description, edit, image, preview } = values;
  const { menu, menuStatus, menuErrors } = useSelector((state) => state.menu);
  const dispatch = useDispatch();

  const handleClick = (id) => {
    dispatch(deleteItemMenu({ idMenu: menu.menu._id, id }));
  };

  const handleEdit = () => {
    if (!edit) {
      setValues({
        name: item.name,
        price: item.price,
        description: item.description,
        edit: true,
      });
    } else {
      let formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("image", image);
      formData.append("idMenu", menu.menu._id);
      formData.append("idItem", item._id);
      formData.append("lastImg", item.image);

      dispatch(editItemMenu(formData));
    }
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

  return (
    <div className="menu-item">
      <div className="menu-item__edit-group">
        <h5>NOM : </h5>
        <span>
          {edit &&
            menuStatus.edit === "failed" &&
            menuErrors.edit.data.filter((err) => err.param === "name")[0] &&
            menuErrors.edit.data.filter((err) => err.param === "name")[0].msg}
        </span>
        {edit ? (
          <input type="text" value={name} name="name" onChange={handleData} />
        ) : (
          <p>{item.name}</p>
        )}
      </div>
      <div className="menu-item__edit-group">
        <h5>prix : </h5>
        <span>
          {edit &&
            menuStatus.edit === "failed" &&
            menuErrors.edit.data.filter((err) => err.param === "price")[0] &&
            menuErrors.edit.data.filter((err) => err.param === "price")[0].msg}
        </span>
        {edit ? (
          <input type="text" value={price} name="price" onChange={handleData} />
        ) : (
          <p>{item.price}</p>
        )}
      </div>
      <div className="menu-item__edit-group">
        <h5>description : </h5>
        <span>
          {edit &&
            menuStatus.edit === "failed" &&
            menuErrors.edit.data.filter(
              (err) => err.param === "description"
            )[0] &&
            menuErrors.edit.data.filter((err) => err.param === "description")[0]
              .msg}
        </span>
        {edit ? (
          <input
            type="text"
            value={description}
            name="description"
            onChange={handleData}
          />
        ) : (
          <p>{item.description}</p>
        )}
      </div>

      {edit ? (
        <input
          className="input-file"
          type="file"
          name="image"
          onChange={handleFile}
        />
      ) : (
        <img src={"/" + item.image} alt="food" />
      )}
      {preview && <img src={preview} alt="plat" />}
      <div className="menu-item__buttons">
        <div>
          <button className="icon_bouton" onClick={() => handleClick(item._id)}>
            <IconContext.Provider value={{ className: "icon__Food" }}>
              <div>
                <MdDelete />
              </div>
            </IconContext.Provider>
            Supprimer
          </button>
        </div>

        <div>
          <button className="icon_bouton" onClick={() => handleEdit(item._id)}>
            <IconContext.Provider value={{ className: "icon__Food" }}>
              <div>
                <RiEdit2Fill />
              </div>
            </IconContext.Provider>
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemsMenu;
