import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import openSocket from 'socket.io-client';

import { ImSpinner9 } from 'react-icons/im';
import { IconContext } from 'react-icons';
import { getAllOrders } from '../../features/orderSlice';
import './OrderList.css';
const socketURL =
  process.env.NODE_ENV === 'production'
    ? window.location.hostname
    : 'https://localhost:5000';

const OrderList = () => {
  const [paid, setPaid] = useState(false);
  const [filterDate, setFilterDate] = useState({
    today: moment().format(),
    filterByDate: false,
  });
  const { today, filterByDate } = filterDate;
  const location = useLocation();
  const { restId } = location.state;
  const dispatch = useDispatch();
  useEffect(() => {
    let socket = openSocket(`${socketURL}/restaurant-space`, {
      transports: ['websocket', 'polling'],
      secure: true,
    });

    socket.on('connect', () => {
      console.log(socket.id);
    });
    if (restId) {
      socket.emit('joinRoom', { restId: restId });
      console.log('restid', restId);
    }

    socket.on('message', (data) => {
      console.log('new order------------', data);

      dispatch(getAllOrders(restId));
    });
    // return () => {
    //   socket.disconnect();
    // };
  }, []);
  useEffect(() => {
    dispatch(getAllOrders(restId));
  }, []);
  const { orders, orderStatus } = useSelector((state) => state.order);
  const handleFilter = (filterBy) => {
    setPaid(filterBy);
  };
  const handleDate = () => {
    setFilterDate({ ...filterDate, filterByDate: !filterByDate });
  };

  return (
    <div className='orders'>
      <h2>List of Orders</h2>
      <div className='orders__buttons'>
        <button
          className={!paid ? 'orders__buttons--active' : 'orders__buttons--normal'}
          onClick={() => handleFilter(false)}>
          Non Payé
        </button>
        <button
          className={paid ? 'orders__buttons--active' : 'orders__buttons--normal'}
          onClick={() => handleFilter(true)}>
          Payé
        </button>
        <button
          className={filterByDate ? 'orders__buttons--active' : 'orders__buttons--normal'}
          onClick={handleDate}>
          Today's orders
        </button>
      </div>

      {orderStatus.getAll === 'loading' ? (
        <IconContext.Provider value={{ className: 'spinner--large' }}>
          <div>
            <ImSpinner9 />
          </div>
        </IconContext.Provider>
      ) : orderStatus.getAll === 'succeded' ? (
        orders &&
        orders
          .filter(
            (order) =>
              order.paid === paid &&
              (filterByDate
                ? moment(order.createdAt).isSame(today, 'day')
                : moment(order.createdAt).isBefore(today, 'day'))
          )
          .map((order) => (
            <div className='orders__items' key={order._id}>
              <p>Table {order.tableNumber}</p>
              {order.items.map((item) => (
                <div className='orders__items__single' key={item._id}>
                  <div className='orders__items__info'>
                    <p>{item.name}</p>
                    <p>{item.quantity}</p>
                    <p className='order__comment'>{item.comment}</p>
                  </div>
                  <p className='orders__items__time'>
                    {moment(item.createdAt).fromNow()}
                  </p>
                </div>
              ))}
              <p>Total : {order.total}</p>
            </div>
          ))
      ) : (
        <h5>Something went wrong..</h5>
      )}
    </div>
  );
};

export default OrderList;
