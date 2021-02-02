import React, { useEffect } from "react";
import AddOwner from "../../Components/AddOwner/AddOwner";
import OwnerList from "../../Components/OwnerList/OwnerList";
import { getAllOwners } from "../../features/adminSlice";
import { useSelector, useDispatch } from "react-redux";
import openSocket from "socket.io-client";
import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
import "./AdminSection.css";
const socketURL =
  process.env.NODE_ENV === "production"
    ? window.location.hostname
    : "http://localhost:5000";

const AdminSection = () => {
  const dispatch = useDispatch();

  let isAuth = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    if (isAuth) {
      dispatch(getAllOwners());
    }
  }, [isAuth]);
  useEffect(() => {
    let socket = openSocket(`${socketURL}/admin-space`, {
      transports: ["websocket", "polling"],
      // secure: true,
    });
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("owners", (data) => {
      console.log("from server", data.action);
      dispatch(getAllOwners());
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const { owners, adminStatus, adminErrors } = useSelector(
    (state) => state.admin
  );

  return (
    <div className="admin">
      <AddOwner />

      {adminStatus.getAll === "loading" ? (
        <IconContext.Provider value={{ className: "spinner--large" }}>
          <div>
            <ImSpinner9 />
          </div>
        </IconContext.Provider>
      ) : adminStatus.getAll === "failed" ? (
        <h2>something went wrong</h2>
      ) : adminStatus.getAll === "succeded" && owners.length > 0 ? (
        <OwnerList owners={owners} />
      ) : (
        <h5>you have no clients</h5>
      )}
    </div>
  );
};

export default AdminSection;
