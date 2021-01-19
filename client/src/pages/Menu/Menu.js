import React from 'react';
import ItemsMenu from '../../Components/ItemsMenu/ItemsMenu';

import './Menu.css';

const Menu = ({ menu, logo }) => {
  return (
    <div className='menu'>
      <img src={'/' + logo} alt='logo' />
      <h5>Entree</h5>
      {menu &&
        menu.menu.items.length > 0 &&
        menu.menu.items
          .filter((item) => item.categorie === 'entree')
          .map((item) => <ItemsMenu key={item._id} item={item} />)}

      <h5>Plat</h5>
      {menu &&
        menu.menu.items.length > 0 &&
        menu.menu.items
          .filter((item) => item.categorie === 'plat')
          .map((item) => <ItemsMenu key={item._id} item={item} />)}
      <h5>Boisson</h5>
      {menu &&
        menu.menu.items.length > 0 &&
        menu.menu.items
          .filter((item) => item.categorie === 'boisson')
          .map((item) => <ItemsMenu key={item._id} item={item} />)}
      <h5>Dessert</h5>
      {menu &&
        menu.menu.items.length > 0 &&
        menu.menu.items
          .filter((item) => item.categorie === 'Dessert')
          .map((item) => <ItemsMenu key={item._id} item={item} />)}
    </div>
  );
};

export default Menu;
