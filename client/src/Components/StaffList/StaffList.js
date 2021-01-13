import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import AddWorker from '../AddWorker/AddWorker';
import Workers from '../Workers/Workers';
import { getAllWorkers } from '../../features/staffSlice';
import './StaffList.css';

const StaffList = () => {
  const location = useLocation();
  const { restId } = location.state;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllWorkers(restId));
  }, [dispatch]);
  const { workers } = useSelector((state) => state.staff);

  return (
    <div className='staff'>
      <AddWorker restId={restId} />
      <Workers list={workers} />
    </div>
  );
};

export default StaffList;
