import React, { useEffect } from 'react';
import AddMenu from '../../Components/AddMenu/AddMenu';
import Menu from '../Menu/Menu';
import { getMenuByRest } from '../../features/menuSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import openSocket from 'socket.io-client';

import './MyRestaurant.css';

const MyRestaurant = () => {
  const location = useLocation();
  const { restId, logo } = location.state;
  console.log('restId', restId);
  const dispatch = useDispatch();
  const { menu, status, updateStatus } = useSelector((state) => state.menu);
  useEffect(() => {
    dispatch(getMenuByRest(restId));
  }, [dispatch, restId]);
  useEffect(() => {
    let socket = openSocket('http://localhost:5000/menu-space', {
      transports: ['websocket', 'polling'],
    });
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.on('hi', (data) => {
      console.log('from server', data);
    });
    socket.on('menu', (data) => {
      console.log('from server', data.action);
      dispatch(getMenuByRest(restId));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, restId]);
  return (
    <div className='my-rest'>
      <AddMenu />
      {updateStatus !== 'loading' && status !== 'loading' ? (
        <Menu menu={menu} logo={logo} />
      ) : (
        <h1>Loading </h1>
      )}
      {/* {updateStatus !== "loading" && status !== "loading" ? (
        <ClientPage menu={menu} />
      ) : (
        <h1>Loading </h1>
      )} */}
    </div>
  );
};

export default MyRestaurant;
