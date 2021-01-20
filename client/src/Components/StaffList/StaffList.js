import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import openSocket from "socket.io-client";

import AddWorker from "../AddWorker/AddWorker";
import Workers from "../Workers/Workers";
import { getAllWorkers } from "../../features/staffSlice";
import "./StaffList.css";

const StaffList = ({ channel }) => {
  const location = useLocation();
  const { restId } = location.state;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllWorkers(restId));
  }, [dispatch]);
  const { workers } = useSelector((state) => state.staff);
  useEffect(() => {
    if (channel) {
      channel.on("workers", (data) => {
        console.log("workers", data.action);
        dispatch(getAllWorkers(restId));
      });
    }
  }, [channel]);

  return (
    <div className="staff">
      <AddWorker restId={restId} />
      <Workers list={workers} />
    </div>
  );
};

export default StaffList;
