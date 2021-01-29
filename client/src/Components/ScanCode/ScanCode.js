import React, { useState, useEffect, Fragment } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authClient } from "../../features/authSlice";
import { FaRegSmileWink } from "react-icons/fa";
import { IconContext } from "react-icons";
import QrReader from "react-qr-scanner";
import "./ScanCode.css";

const ScanCode = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { authStatus } = useSelector((state) => state.auth);
  const [values, setValues] = useState({
    delay: 100,
    result: null,
    code: "",
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
  const handleInput = (e) => {
    setValues({ ...values, code: e.target.value });
  };
  const handleSubmit = () => {
    setValues({ ...values, result: code });
  };
  useEffect(() => {
    if (result)
      dispatch(
        authClient({
          restId: result.split("+")[0],
          tableNumber: result.split("+")[1],
          history,
        })
      );
  }, [result]);

  return (
    <div className="code">
      {authStatus.authClient === "failed" ? (
        <div className="message-client">
          <IconContext.Provider value={{ className: "auth-failed" }}>
            <div>
              <FaRegSmileWink />
            </div>
          </IconContext.Provider>
          <p>Ce qr Code n'est pas valide </p>
        </div>
      ) : (
        <Fragment>
          <div className="reader">
            {/* <QrReader
              delay={delay}
              style={previewStyle}
              onError={handleError}
              onScan={handleScan}
            /> */}
          </div>
          <input
            size="50"
            className="test"
            type="text"
            name="code"
            value={code}
            onChange={handleInput}
          />
          <button onClick={handleSubmit}>confirm</button>
          <h1>{result}</h1>
        </Fragment>
      )}
    </div>
  );
};

export default ScanCode;
