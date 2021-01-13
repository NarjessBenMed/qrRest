import React, { useEffect } from 'react';
import AddOwner from '../../Components/AddOwner/AddOwner';
import OwnerList from '../../Components/OwnerList/OwnerList';
import { getAllOwners } from '../../features/adminSlice';
import { useSelector, useDispatch } from 'react-redux';
import openSocket from 'socket.io-client';
import './AdminSection.css';

const AdminSection = () => {
  const dispatch = useDispatch();

  let isAuth = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    if (isAuth) {
      dispatch(getAllOwners());
    }
  }, [isAuth, dispatch]);
  useEffect(() => {
    let socket = openSocket('http://localhost:5000/admin-space', {
      transports: ['websocket', 'polling'],
    });
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.on('hi', (data) => {
      console.log('from server', data);
    });
    socket.on('owners', (data) => {
      console.log('from server', data.action);
      dispatch(getAllOwners());
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const { owners } = useSelector((state) => state.admin);

  return (
    <div className='admin'>
      <AddOwner />

      <OwnerList owners={owners} />
    </div>
  );
};

export default AdminSection;
