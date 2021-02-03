import React, { useEffect } from "react";
import AddTable from "../AddTable/AddTable";
import Tables from "../Tables/Tables";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { ImSpinner9 } from "react-icons/im";
import { IconContext } from "react-icons";
import { getTables } from "../../features/tableSlice";
import "./TableList.css";

const TableList = ({ channel }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { restId } = location.state;
  useEffect(() => {
    dispatch(getTables(restId));
  }, [dispatch, restId]);
  useEffect(() => {
    if (channel) {
      channel.on("tables", (data) => {
        console.log("tables", data.action);
        dispatch(getTables(restId));
      });
    }
  }, [channel]);

  const { listTable, tableStatus } = useSelector((state) => state.table);
  return (
    <div className="table-list">
      <AddTable restId={restId} tables={listTable} />
      {tableStatus.getAll === "loading" ? (
        <IconContext.Provider value={{ className: "spinner--large" }}>
          <div>
            <ImSpinner9 />
          </div>
        </IconContext.Provider>
      ) : tableStatus.getAll === "failed" ? (
        <h4>une erreur est survenue ! veuillez réésayer SVP</h4>
      ) : tableStatus.getAll === "succeded" && listTable.length > 0 ? (
        <Tables tables={listTable} />
      ) : (
        <h4>Aucune table n'est enregistrée </h4>
      )}
    </div>
  );
};

export default TableList;
