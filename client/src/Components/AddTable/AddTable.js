import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTable } from "../../features/tableSlice";
import "./AddTable.css";

const AddTable = ({ restId, handleAdd, tables }) => {
  const [values, setValues] = useState({
    tableNumber: "",
    tableCode: "",
  });
  const { tableNumber, tableCode } = values;
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setValues({
      tableNumber: e.target.value,
      tableCode: restId + "+" + e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(addTable({ tableNumber, tableCode, restaurant: restId }));
    handleAdd();
  };
  return (
    <div className="add-table">
      <h3>Table creation </h3>
      <form className="add-table__form">
        <div className="add-table__form__group">
          <h5>Table Number</h5>

          <input
            type="text"
            name="tableNumber"
            value={tableNumber}
            onChange={handleChange}
            disabled
          />
        </div>

        <button type="submit" onClick={handleSubmit}>
          Add table
        </button>
      </form>
    </div>
  );
};

export default AddTable;
