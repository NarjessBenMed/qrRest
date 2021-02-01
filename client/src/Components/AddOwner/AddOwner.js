import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ImSpinner9 } from 'react-icons/im';
import { IconContext } from 'react-icons';
import { createOwner } from '../../features/adminSlice';
import './AddOwner.css';

const AddOwner = () => {
  const [values, setValues] = useState({
    username: '',
    password: '',
  });
  const { username, password } = values;
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const { adminStatus, adminErrors } = useSelector((state) => state.admin);
  useEffect(() => {
    if (adminStatus.create === 'succeded') {
      setValues({ username: '', password: '' });
    }
  }, [adminStatus]);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createOwner({ username, password }));
  };
  return (
    <div className='addowner'>
      <h3>Create new Owner</h3>
      <form>
        <div className='addowner__form__group'>
          <h5>Username</h5>

          <span>
            {adminStatus.create === 'failed' &&
              adminErrors.create &&
              adminErrors.create.data.filter((err) => err.param === 'username')[0].msg}
          </span>

          <input
            type='text'
            className='addowner__container__form__input valid__input'
            name='username'
            value={username}
            onChange={handleChange}
          />
        </div>
        <div className='addowner__form__group'>
          <h5>Password</h5>

          <span>
            {adminStatus.create === 'failed' &&
              adminErrors.create &&
              adminErrors.create.data.filter((err) => err.param === 'password')[0].msg}
          </span>

          <input
            type='password'
            className='addowner__container__form__input valid__input'
            name='password'
            value={password}
            onChange={handleChange}
          />
        </div>
        <button type='submit' className='addowner__addownerButton' onClick={handleSubmit}>
          {adminStatus.create === 'loading' ? (
            <IconContext.Provider value={{ className: 'spinner' }}>
              <div>
                <ImSpinner9 />
              </div>
            </IconContext.Provider>
          ) : (
            <span>Add</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddOwner;
