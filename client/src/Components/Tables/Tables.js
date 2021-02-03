import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { deleteTable } from "../../features/tableSlice";
import "./Tables.css";

const Tables = ({ tables }) => {
  const dispatch = useDispatch();
  const componentRef = useRef();
  const handleDelete = (id) => {
    dispatch(deleteTable(id));
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page {
    size: 100mm 100mm;
  }
    `,
  });
  return (
    <div className="tables">
      <h4>liste des tables</h4>
      {tables &&
        tables.map((table) => (
          <div className="tables__single-table" key={table._id}>
            <div className="tables__single-table__info">
              <h4>Numéro de table</h4>
              <p>{table.tableNumber}</p>
            </div>
            <img
              ref={componentRef}
              src={"/images/" + table.codeImg}
              alt="code"
            />
            <div className="tables__single-table__buttons">
              <button onClick={handlePrint}>Imprimer</button>
              <button onClick={() => handleDelete(table._id)}>Supprimer</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Tables;
