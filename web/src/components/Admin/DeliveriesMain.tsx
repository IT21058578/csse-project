import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Spinner from "../Spinner";
import { useGetAlldeliveriesQuery } from "../../store/apiquery/DeliveriesApiSlice";
import { Delivery } from "../../types";


const ListOfdeliveries = ({
  setdeliverie,
  setPage,
}: {
  setdeliverie: Function;
  setPage: Function;
}) => {
  const {
    isLoading,
    data: deliveriesList,
    isSuccess,
    isError,
  } = useGetAlldeliveriesQuery("api/deliveries");


  const parsedeliverie = (deliverie: Delivery) => {
    setdeliverie(deliverie);
    setPage("add");
  };

  // search bar coding 
  const [searchInput, setSearchInput] = useState<string>('');

  let content: React.ReactNode;

  // Filter deliveries based on the search input
    const filtereddeliveries = deliveriesList?.content.filter((deliverie: Delivery) =>{
      const suplierID = deliverie.supplierId?.toLowerCase();
      const search = searchInput.toLowerCase();

  
      return (
        suplierID?.includes(search)
      );
    });

  content =
    isLoading || isError
      ? null
      : isSuccess
      ? filtereddeliveries.map((deliverie: Delivery) => {
          // ? sortdeliveries.map((deliverie: deliverieType) => {

          return (
            <tr className="p-3" key={deliverie._id}>
              <td className="fw-bold">{deliverie._id}</td>
              <td>{deliverie.supplierId}</td>
              <td>{deliverie.procurementId}</td>
              <td className="fw-bold">{deliverie.companyId}</td>
              <td>{deliverie.itemId}</td>
              <td>{deliverie.qty}</td>
            </tr>
          );
        })
      : null;

  return !isLoading ? (
    <div>
      {/* Add a search input field */}
      <div className="mb-3">
      <input
        type="text"
        placeholder="Search deliveries"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
    <div className="table-responsive">
      <table className="table table-default text-center table-bordered">
        <thead>
          <tr className="fd-bg-primary text-white">
            <th scope="col" className="p-3">
              DELIVERY ID
            </th>
            <th scope="col" className="p-3">
              SUPPLIER ID            
            </th>
            <th scope="col" className="p-3">
              PROCUMENT ID
            </th>
            <th scope="col" className="p-3">
              COMPANY ID
            </th>
            <th scope="col" className="p-3">
              ITEM ID
            </th>
            <th scope="col" className="p-3">
              QTY
            </th>
          </tr>
        </thead>
        <tbody>{content}</tbody>
      </table>
    </div>
    </div>
  ) : (
    <Spinner />
  );
};

const DeliverieMain = () => {
  const [page, setPage] = useState("list");
  const [currentdeliverie, setCurrentdeliverie] = useState(null);

  const changeToList = () => {
    setPage("add");
    setCurrentdeliverie(null);
  };
  const changeToAdd = () => {
    setPage("list");
  };

  useEffect(() => setPage("list"), []);

  return (
    <div className="text-black">
      <h4 className="fw-bold">deliveries</h4>
      <div className="subPartMain">
          <ListOfdeliveries setdeliverie={setCurrentdeliverie} setPage={setPage} />
      </div>
    </div>
  );
};

export default DeliverieMain;