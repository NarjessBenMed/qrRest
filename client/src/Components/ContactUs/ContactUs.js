import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { contactUs } from "../../features/contactSlice";
import "./ContactUs.css";

const ContactUs = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    message: "",
  });
  const { username, email, message } = values;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const dispatch = useDispatch();
  const { contactStatus, errors } = useSelector((state) => state.contact);
  useEffect(() => {
    if (contactStatus === "succeded")
      setValues({ username: "", email: "", message: "" });
  }, [contactStatus]);
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(contactUs({ username, email, message }));
  };

  return (
    <div>
      <form className="contact__Form">
        <span>
          {contactStatus === "failed" &&
            errors.data.filter((err) => err.param === "username")[0] &&
            errors.data.filter((err) => err.param === "username")[0].msg}
        </span>
        <input
          type="text"
          name="username"
          value={username}
          placeholder=" nom"
          onChange={handleChange}
        />

        <span>
          {contactStatus === "failed" &&
            errors.data.filter((err) => err.param === "email")[0] &&
            errors.data.filter((err) => err.param === "email")[0].msg}
        </span>

        <input
          type="email"
          name="email"
          value={email}
          placeholder=" email"
          onChange={handleChange}
        />
        <span>
          {contactStatus === "failed" &&
            errors.data.filter((err) => err.param === "message")[0] &&
            errors.data.filter((err) => err.param === "message")[0].msg}
        </span>
        <textarea
          rows="8"
          cols="20"
          value={message}
          placeholder="message"
          name="message"
          onChange={handleChange}
        ></textarea>
        <button className="Butt__send" type="submit" onClick={handleSubmit}>
          envoyer
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
