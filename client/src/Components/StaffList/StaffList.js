import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import openSocket from "socket.io-client";

import AddWorker from "../AddWorker/AddWorker";
import Workers from "../Workers/Workers";
import { getAllWorkers } from "../../features/staffSlice";
import "./StaffList.css";

const StaffList = () => {
  const location = useLocation();
  const { restId } = location.state;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllWorkers(restId));
  }, [dispatch]);
  const { workers } = useSelector((state) => state.staff);
  useEffect(() => {
    let socket = openSocket("http://localhost:5000/owner-space", {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.emit("joinRoom", { restId });

    socket.on("message", (data) => {
      console.log(data.msg);

      dispatch(getAllWorkers(restId));
    });
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <div className="staff">
      <AddWorker restId={restId} />
      <Workers list={workers} />
    </div>
  );
};

export default StaffList;
