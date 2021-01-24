import React, { useEffect } from 'react';
import AddTable from '../AddTable/AddTable';
import Tables from '../Tables/Tables';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getTables } from '../../features/tableSlice';
import './TableList.css';
const TableList = ({ channel }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { restId } = location.state;
  useEffect(() => {
    dispatch(getTables(restId));
  }, [dispatch, restId]);
  useEffect(() => {
    if (channel) {
      channel.on('tables', (data) => {
        console.log('tables', data.action);
        dispatch(getTables(restId));
      });
    }
  }, [channel]);

  const { listTable } = useSelector((state) => state.table);
  return (
    <div className='table-list'>
      <AddTable restId={restId} tables={listTable} />
      <Tables tables={listTable} />
    </div>
  );
};

export default TableList;
