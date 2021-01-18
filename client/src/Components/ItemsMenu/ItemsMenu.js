import React, { useState, useEffect } from "react";
import "./ItemsMenu.css";
import { deleteItemMenu, editItemMenu } from "../../features/menuSlice";
import { useDispatch, useSelector } from "react-redux";
import { generateBase64FromImage } from "../../utils/image";

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
  const { menu } = useSelector((state) => state.menu);
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
      {preview && <img src={preview} alt="plat" />}
      {edit ? (
        <input type="file" name="image" onChange={handleFile} />
      ) : (
        <img src={"/" + item.image} alt="food" />
      )}
      {edit ? (
        <input type="text" value={name} name="name" onChange={handleData} />
      ) : (
        <h4>Name :{item.name}</h4>
      )}
      {edit ? (
        <input type="text" value={price} name="price" onChange={handleData} />
      ) : (
        <h4>Price : {item.price}</h4>
      )}
      {edit ? (
        <input
          type="text"
          value={description}
          name="description"
          onChange={handleData}
        />
      ) : (
        <h4>Description : {item.description}</h4>
      )}
      <button className="btn" onClick={() => handleClick(item._id)}>
        delete
      </button>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};

export default ItemsMenu;
