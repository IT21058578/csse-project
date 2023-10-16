import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Spinner from "../Spinner";
import { useGetAllinvoicesQuery } from "../../store/apiquery/InvoiceApiSlice";
import { Invoice } from "../../types";


const ListOfinvoices = ({
  setinvoice,
  setPage,
}: {
  setinvoice: Function;
  setPage: Function;
}) => {
  const {
    isLoading,
    data: invoicesList,
    isSuccess,
    isError,
  } = useGetAllinvoicesQuery("api/invoices");


  const parseinvoice = (invoice: Invoice) => {
    setinvoice(invoice);
    setPage("add");
  };

  // search bar coding 
  const [searchInput, setSearchInput] = useState<string>('');

  let content: React.ReactNode;

  // Filter invoices based on the search input
    const filteredinvoices = invoicesList?.content.filter((invoice: Invoice) =>{
      const suplierID = invoice.supplierId?.toLowerCase();
      const search = searchInput.toLowerCase();

  
      return (
        suplierID?.includes(search)
      );
    });

  content =
    isLoading || isError
      ? null
      : isSuccess
      ? filteredinvoices.map((invoice: Invoice) => {
          // ? sortinvoices.map((invoice: invoiceType) => {

          return (
            <tr className="p-3" key={invoice._id}>
              <td className="fw-bold">{invoice._id}</td>
              <td>{invoice.companyId}</td>
              <td>{invoice.procurementId}</td>
              <td className="fw-bold">{invoice.supplierId}</td>
              <td>{invoice.itemId}</td>
              <td>
                  {invoice.invoiceUrls.map((url, index) => (
                    <div key={index}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                      </a>
                    </div>
                  ))}
              </td>
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
        placeholder="Search invoices"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
    <div className="table-responsive">
      <table className="table table-default text-center table-bordered">
        <thead>
          <tr className="fd-bg-primary text-white">
            <th scope="col" className="p-3">
              INVOICE ID
            </th>
            <th scope="col" className="p-3">
              COMPANY ID            
            </th>
            <th scope="col" className="p-3">
              PROCUMENT ID
            </th>
            <th scope="col" className="p-3">
              SUPPLIER ID
            </th>
            <th scope="col" className="p-3">
              ITEM ID
            </th>
            <th scope="col" className="p-3">
              INVOICE URLS
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

const invoiceMain = () => {
  const [page, setPage] = useState("list");
  const [currentinvoice, setCurrentinvoice] = useState(null);

  const changeToList = () => {
    setPage("add");
    setCurrentinvoice(null);
  };
  const changeToAdd = () => {
    setPage("list");
  };

  useEffect(() => setPage("list"), []);

  return (
    <div className="text-black">
      <h4 className="fw-bold">invoices</h4>
      <div className="subPartMain">
          <ListOfinvoices setinvoice={setCurrentinvoice} setPage={setPage} />
      </div>
    </div>
  );
};

export default invoiceMain;