import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authClient } from '../../features/authSlice';
import QrReader from 'react-qr-scanner';
import './ScanCode.css';

const ScanCode = () => {
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    delay: 100,
    result: null,
    code: '',
  });
  const { delay, result, code } = values;
  const handleScan = (data) => {
    setValues({ ...values, result: data });
  };
  const handleError = (err) => {
    console.error(err);
  };
  const previewStyle = {
    height: 320,
    width: 240,
  };
  // const handleInput = (e) => {
  //   setValues({ ...values, code: e.target.value });
  // };
  // const handleSubmit = () => {
  //   setValues({ ...values, result: code });
  // };

  if (result) {
    dispatch(authClient(result.split('+')[0], result.split('+')[1]));
    localStorage.setItem('restId', result.split('+')[0]);
    localStorage.setItem('tableNumber', result.split('+')[1]);
    return (
      <Redirect
        to={{
          pathname: '/client-page',
          state: {
            restId: result.split('+')[0],
            tableNumber: result.split('+')[1],
          },
        }}
      />
    );
  }
  return (
    <div className='code'>
      <div className='reader'>
        <QrReader
          delay={delay}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
        />
      </div>
      {/* <input type="text" name="code" value={code} onChange={handleInput} />
      <button onClick={handleSubmit}>confirm</button>
      <h1>{result}</h1> */}
    </div>
  );
};

export default ScanCode;
