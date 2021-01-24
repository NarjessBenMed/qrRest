import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './WorkerSection.css';
import { getAllOrders, checkoutOrder } from '../../features/orderSlice';
import { getTables } from '../../features/tableSlice';
import openSocket from 'socket.io-client';
import moment from 'moment';

const WorkerSection = () => {
  const [filterBy, setFilterBy] = useState('');
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    let socket = openSocket('http://localhost:5000/restaurant-space', {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log(socket.id);
    });
    if (user) {
      socket.emit('joinRoom', { restId: user.restaurantId });
      console.log('restid', user.restaurantId);
    }
    socket.on('hi', (data) => {
      console.log('from server', data);
    });
    socket.on('message', (data) => {
      console.log('new order------------', data);

      dispatch(getAllOrders(user.restaurantId));
    });
    return () => {
      socket.disconnect();
    };
  }, [user]);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getTables(user.restaurantId));
      dispatch(getAllOrders(user.restaurantId));
    }
  }, [isAuthenticated]);
  const { listTable } = useSelector((state) => state.table);
  useEffect(() => {
    if (listTable) setFilterBy(listTable[0].tableNumber);
  }, [listTable]);
  const { orders, status } = useSelector((state) => state.order);

  const handleChange = (e) => {
    setFilterBy(e.target.value);
  };
  const handleClick = (id) => {
    dispatch(checkoutOrder({ orderId: id }));
    dispatch(getAllOrders(user.restaurantId));
  };
  return (
    <div className='worker'>
      <h2>List of orders</h2>
      <div className='worker__tables'>
        <p>Select Your Table</p>
        <select name='filterBy' onChange={handleChange}>
          {listTable &&
            listTable.map((tab, i) => (
              <option key={tab._id} defaultValue value={tab.tableNumber}>
                table {tab.tableNumber}
              </option>
            ))}
        </select>
      </div>
      <div className='worker__content'>
        {status !== 'loading' &&
          orders &&
          // filterBy &&
          orders
            // .filter((order) => order.tableNumber == filterBy && !order.paid)
            .filter((order) => !order.paid && order.tableNumber === filterBy)
            .map((order) => (
              <div className='worker__orders' key={order._id}>
                {order.items.map((item) => (
                  <div className='worker__orders__items' key={item._id}>
                    <div className='worker__orders__items__info'>
                      <p>{item.name}</p>
                      <p>{item.quantity}</p>
                    </div>
                    <span className='comment'>{item.comment}</span>
                    <span className='timeline'>
                      {/* {moment(item.updatedAt).startOf('minute').fromNow()} */}
                      {moment(item.createdAt).fromNow()}
                    </span>
                  </div>
                ))}
                <button onClick={() => handleClick(order._id)}>Checkout order</button>
              </div>
            ))}
      </div>
    </div>
  );
};

export default WorkerSection;
