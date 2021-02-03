import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
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
  }, []);
  const { workers, workerStatus } = useSelector((state) => state.staff);
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
      {workerStatus.getAll === "loading" ? (
        <IconContext.Provider value={{ className: "spinner--large" }}>
          <div>
            <ImSpinner9 />
          </div>
        </IconContext.Provider>
      ) : workerStatus.getAll === "failed" ? (
        <h4>Une erreur est survenue</h4>
      ) : workerStatus.getAll === "succeded" && workers.length > 0 ? (
        <Workers list={workers} />
      ) : (
        <h4>La liste des personnels est vide </h4>
      )}
    </div>
  );
};

export default StaffList;
