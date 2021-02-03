import React from "react";

import ItemsMenu from "../../Components/ItemsMenu/ItemsMenu";
import "./Menu.css";

const Menu = ({ menu }) => {
  return (
    <div className="menu">
      <p className="menu__cat">Entrée</p>
      <div className="menu__cat__list">
        {menu.menu.items
          .filter((item) => item.categorie === "entree")
          .map((item) => (
            <ItemsMenu key={item._id} item={item} />
          ))}
      </div>

      <p className="menu__cat">Plat</p>
      <div className="menu__cat__list">
        {menu.menu.items
          .filter((item) => item.categorie === "plat")
          .map((item) => (
            <ItemsMenu key={item._id} item={item} />
          ))}
      </div>

      <p className="menu__cat">Boisson</p>
      <div className="menu__cat__list">
        {menu.menu.items
          .filter((item) => item.categorie === "boisson")
          .map((item) => (
            <ItemsMenu key={item._id} item={item} />
          ))}
      </div>

      <p className="menu__cat">Dessert</p>
      <div className="menu__cat__list">
        {menu.menu.items
          .filter((item) => item.categorie === "Dessert")
          .map((item) => (
            <ItemsMenu key={item._id} item={item} />
          ))}
      </div>
    </div>
  );
};

export default Menu;
