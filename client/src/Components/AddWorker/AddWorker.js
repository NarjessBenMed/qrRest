import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { createWorker } from '../../features/staffSlice';
import './AddWorker.css';

const AddWorker = ({ restId }) => {
  const [values, setValues] = useState({
    username: '',
    password: '',
  });
  const { username, password } = values;
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createWorker({ username, password, restaurantId: restId }));
    setValues({ username: '', password: '' });
  };

  return (
    <div className='add-worker'>
      <h3>Create new Worker</h3>
      <form>
        <div className='add-worker__form__group'>
          <h5>Username</h5>
          <input
            type='text'
            className='add-worker__container__form__input'
            name='username'
            value={username}
            onChange={handleChange}
          />
        </div>
        <div className='add-worker__form__group'>
          <h5>Password</h5>
          <input
            type='password'
            className='add-worker__container__form__input'
            name='password'
            value={password}
            onChange={handleChange}
          />
        </div>

        <button type='submit' className='add-worker__addButton' onClick={handleSubmit}>
          new Worker
        </button>
      </form>
    </div>
  );
};

export default AddWorker;
