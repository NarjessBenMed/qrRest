import React from "react";
import { useSelector } from "react-redux";
import ItemsMenu from "../../Components/ItemsMenu/ItemsMenu";
import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
import "./Menu.css";

const Menu = ({ menu, logo }) => {
  const { menuStatus, menuErrors } = useSelector((state) => state.menu);
  return (
    <div className="menu">
      {/* <img src={'/' + logo} alt='logo' /> */}
      <p className="menu__cat">Entree</p>
      <div className="menu__cat__list">
        {menuStatus.getMenu === "loading" ? (
          <IconContext.Provider value={{ className: "spinner--large" }}>
            <div>
              <ImSpinner9 />
            </div>
          </IconContext.Provider>
        ) : menuStatus.getMenu === "failed" ? (
          <h2>Something went wrong..</h2>
        ) : menuStatus.getMenu === "succeded" &&
          menu &&
          menu.menu.items.length > 0 ? (
          menu.menu.items
            .filter((item) => item.categorie === "entree")
            .map((item) => <ItemsMenu key={item._id} item={item} />)
        ) : (
          <h5>no entree found</h5>
        )}
      </div>

      <p className="menu__cat">Plat</p>
      <div className="menu__cat__list">
        {menuStatus.getMenu === "loading" ? (
          <IconContext.Provider value={{ className: "spinner--large" }}>
            <div>
              <ImSpinner9 />
            </div>
          </IconContext.Provider>
        ) : menuStatus.getMenu === "failed" ? (
          <h2>Something went wrong..</h2>
        ) : menuStatus.getMenu === "succeded" &&
          menu &&
          menu.menu.items.length > 0 ? (
          menu.menu.items
            .filter((item) => item.categorie === "plat")
            .map((item) => <ItemsMenu key={item._id} item={item} />)
        ) : (
          <h5>no plat found</h5>
        )}
      </div>

      <p className="menu__cat">Boisson</p>
      <div className="menu__cat__list">
        {menuStatus.getMenu === "loading" ? (
          <IconContext.Provider value={{ className: "spinner--large" }}>
            <div>
              <ImSpinner9 />
            </div>
          </IconContext.Provider>
        ) : menuStatus.getMenu === "failed" ? (
          <h2>Something went wrong..</h2>
        ) : menuStatus.getMenu === "succeded" &&
          menu &&
          menu.menu.items.length > 0 ? (
          menu.menu.items
            .filter((item) => item.categorie === "boisson")
            .map((item) => <ItemsMenu key={item._id} item={item} />)
        ) : (
          <h5>no boisson found</h5>
        )}
      </div>

      <p className="menu__cat">Dessert</p>
      <div className="menu__cat__list">
        {menuStatus.getMenu === "loading" ? (
          <IconContext.Provider value={{ className: "spinner--large" }}>
            <div>
              <ImSpinner9 />
            </div>
          </IconContext.Provider>
        ) : menuStatus.getMenu === "failed" ? (
          <h2>Something went wrong..</h2>
        ) : menuStatus.getMenu === "succeded" &&
          menu &&
          menu.menu.items.length > 0 ? (
          menu.menu.items
            .filter((item) => item.categorie === "Dessert")
            .map((item) => <ItemsMenu key={item._id} item={item} />)
        ) : (
          <h5>no dessert found</h5>
        )}
      </div>
    </div>
  );
};

export default Menu;
