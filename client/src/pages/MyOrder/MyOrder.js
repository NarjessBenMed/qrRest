import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getOrderById } from '../../features/orderSlice';
import './MyOrder.css';

const MyOrder = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { orderId } = location.state;
  useEffect(() => {
    console.log('orederid', orderId);
    dispatch(getOrderById(orderId));
  }, [orderId]);
  const { order, status } = useSelector((state) => state.order);
  return (
    <div className='order'>
      <h1>A Payer</h1>
      {status === 'succeded' &&
        order &&
        order.order.items.map((item) => (
          <div className='order__item' key={item._id}>
            <p>{item.name}</p>
            <div className='order__item__info'>
              <p>{item.quantity}</p>
              <p>{item.price} DT</p>
            </div>
          </div>
        ))}
      <div className='order__item__total'>
        <p>total:</p>
        <p>{status !== 'loading' && order && order.order.total} DT</p>
      </div>
    </div>
  );
};

export default MyOrder;
