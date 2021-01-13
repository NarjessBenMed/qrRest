import React, { useEffect, useState, Fragment } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link, useLocation } from 'react-router-dom';
import { createOrder, updateOrder, getOrderById } from '../../features/orderSlice';
import ClientMenuItem from '../../Components/ClientMenuItem/ClientMenuItem';
import './ClientMenu.css';

const ClientMenu = ({ menu, restaurantId }) => {
  const [values, setValues] = useState({
    orderId: null,
    items: [],
    total: 0,
  });
  const { items, total, orderId } = values;

  useEffect(() => {
    const id = localStorage.getItem('id');
    if (id) {
      dispatch(getOrderById(id));
      setValues({ ...values, orderId: id });
    }
  }, []);
  useEffect(() => {
    if (items.length > 0) {
      let totalCost = items.reduce((acc, curv) => Number(acc) + Number(curv.price), 0);
      console.log(totalCost);
      setValues({ ...values, total: totalCost });
    } else {
      setValues({ ...values, total: 0 });
    }
  }, [items]);
  const { order, status } = useSelector((state) => state.order);
  const history = useHistory();
  const location = useLocation();
  const restId = localStorage.getItem('restId');
  const tableNumber = localStorage.getItem('tableNumber');

  const dispatch = useDispatch();
  const handleAdd = (name, quantity, price, createdAt) => {
    const itemIndex = items.findIndex((item) => item.name === name);
    let newList = [...items];
    if (itemIndex === -1) {
      setValues({
        ...values,
        items: [...items, { name, price, quantity, createdAt }],
      });
    } else {
      if (quantity === 0) {
        newList.splice(itemIndex, 1);
      } else {
        newList[itemIndex] = {
          ...newList[itemIndex],
          quantity,
          price,
          createdAt,
        };
      }
      setValues({ ...values, items: newList });
    }
  };

  const handleButton = () => {
    const orderId = localStorage.getItem('id');
    if (items.length > 0) {
      if (orderId && order && !order.order.paid) {
        dispatch(updateOrder({ data: { items, total, orderId }, history }));
      } else {
        dispatch(createOrder({ data: { items, total, restId, tableNumber }, history }));
      }
    }
  };

  const orderLink = order && !order.order.paid && (
    <Link
      to={{
        pathname: '/client-page/order',

        state: { orderId: order.order._id },
      }}>
      <span className='client-menu__link'>My order</span>
    </Link>
  );
  const menuItems =
    menu && menu.menu.items ? (
      <Fragment>
        <p className='client-menu__categorie'>Entree</p>
        <div className='client-menu__sub'>
          {menu.menu.items
            .filter((item) => item.categorie === 'entree')
            .map((item) => (
              <ClientMenuItem key={item._id} item={item} addToCommand={handleAdd} />
            ))}
        </div>
        <p className='client-menu__categorie'>Plat</p>
        <div className='client-menu__sub'>
          {menu.menu.items
            .filter((item) => item.categorie === 'plat')
            .map((item) => (
              <ClientMenuItem key={item._id} item={item} addToCommand={handleAdd} />
            ))}
        </div>
        <p className='client-menu__categorie'>Boisson</p>
        <div className='client-menu__sub'>
          {menu.menu.items
            .filter((item) => item.categorie === 'boisson')
            .map((item) => (
              <ClientMenuItem key={item._id} item={item} addToCommand={handleAdd} />
            ))}
        </div>
        <p className='client-menu__categorie'>Dessert</p>
        <div className='client-menu__sub'>
          {menu.menu.items
            .filter((item) => item.categorie === 'Dessert')
            .map((item) => (
              <ClientMenuItem key={item._id} item={item} addToCommand={handleAdd} />
            ))}
        </div>
      </Fragment>
    ) : (
      // menu.menu.items.map((item) => (
      //   <ClientMenuItem key={item._id} item={item} addToCommand={handleAdd} />
      // ))
      <h5>Loading...</h5>
    );
  return (
    <div className='client-menu'>
      <div className='client-menu__items'>{menuItems}</div>
      <div className='client-menu__nav'>
        {orderLink}
        <button onClick={() => handleButton()}>Order Now</button>
      </div>
    </div>
  );
};

export default ClientMenu;
