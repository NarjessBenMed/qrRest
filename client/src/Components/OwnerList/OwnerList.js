import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteOwner } from '../../features/adminSlice';

import './OwnerList.css';

const OwnerList = ({ owners }) => {
  const dispatch = useDispatch();
  const handleClick = (id) => {
    dispatch(deleteOwner({ id }));
  };
  return (
    <div className='ownerlist'>
      <h3>List of Clients</h3>
      {owners && owners.length > 0 ? (
        owners.map((owner) => (
          <div className='ownerlist__item' key={owner._id}>
            <h5>The Owner :</h5>
            <span>{owner.username}</span>
            <button onClick={() => handleClick(owner._id)} className='owner__btn'>
              delete
            </button>
          </div>
        ))
      ) : (
        <h5>you have no client yet</h5>
      )}
    </div>
  );
};

export default OwnerList;
