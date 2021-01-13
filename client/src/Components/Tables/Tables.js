import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTable } from '../../features/tableSlice';
import './Tables.css';

const Tables = ({ tables, handleAdd }) => {
  const dispatch = useDispatch();
  const handleDelete = (id) => {
    dispatch(deleteTable(id));
    handleAdd();
  };
  return (
    <div className='tables'>
      {tables &&
        tables.map((table) => (
          <div className='tables__single-table' key={table._id}>
            <h5>Table Number</h5>
            <p>{table.tableNumber}</p>
            <img src={'/images/' + table.codeImg} alt='code' />
            <button onClick={() => handleDelete(table._id)}>Delete</button>
          </div>
        ))}
    </div>
  );
};

export default Tables;
