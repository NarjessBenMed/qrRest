import React, { useEffect, useState } from "react";
import AddTable from "../AddTable/AddTable";
import Tables from "../Tables/Tables";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getTables } from "../../features/tableSlice";
import "./TableList.css";
const TableList = () => {
  const [added, setAdded] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { restId } = location.state;
  useEffect(() => {
    dispatch(getTables(restId));
  }, [dispatch, restId]);
  const handleAdd = () => {
    dispatch(getTables(restId));
    setAdded(true);
  };
  const { listTable } = useSelector((state) => state.table);
  return (
    <div className="table-list">
      <AddTable restId={restId} handleAdd={handleAdd} tables={listTable} />
      <Tables tables={listTable} handleAdd={handleAdd} />
    </div>
  );
};

export default TableList;
