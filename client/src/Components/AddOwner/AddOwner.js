import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { initErrors } from '../../features/adminSlice';
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
  const { status, errors } = useSelector((state) => state.admin);
  useEffect(() => {
    if (status === 'succeded') {
      setValues({ username: '', password: '' });
      dispatch(initErrors());
    }
  }, [status, dispatch]);
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
          {errors &&
          errors.data &&
          errors.data.filter((err) => err.param === 'username')[0] ? (
            <Fragment>
              <input
                type='text'
                className='addowner__container__form__input error__input'
                name='username'
                value={username}
                onChange={handleChange}
              />
              <span>
                {errors &&
                  errors.data &&
                  errors.data.filter((err) => err.param === 'username')[0].msg}
              </span>
            </Fragment>
          ) : (
            <input
              type='text'
              className='addowner__container__form__input valid__input'
              name='username'
              value={username}
              onChange={handleChange}
            />
          )}
        </div>
        <div className='addowner__form__group'>
          <h5>Password</h5>
          {errors &&
          errors.data &&
          errors.data.filter((err) => err.param === 'password')[0] ? (
            <Fragment>
              <input
                type='password'
                className='addowner__container__form__input error__input'
                name='password'
                value={password}
                onChange={handleChange}
              />
              <span>{errors.data.filter((err) => err.param === 'password')[0].msg}</span>
            </Fragment>
          ) : (
            <input
              type='password'
              className='addowner__container__form__input valid__input'
              name='password'
              value={password}
              onChange={handleChange}
            />
          )}
        </div>
        <button type='submit' className='addowner__addownerButton' onClick={handleSubmit}>
          {status === 'loading' ? (
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
