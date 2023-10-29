import React, { useState, SyntheticEvent } from "react";
import Swal from "sweetalert2";
import Spinner from "../Spinner";
import { HandleResult } from "../HandleResult";
import { ToastContainer, toast } from "react-toastify";
import {
  useGetAllitemrequestsQuery,
  useGetitemrequestQuery,
} from "../../store/apiquery/ItemRequestApiSlice";
import { usePassApprovalMutation } from "../../store/apiquery/ApprovalsApiSlice";
import { ItemRequest } from "../../types";
import { Approval } from "../../types";
import { getItem } from "../../Utils/Generals";
import RoutePaths from "../../config";

const ListOfOrders = ({
  setOrders,
  setPage,
}: {
  setOrders: Function;
  setPage: Function;
}) => {
  const parseOrders = (Orders: ItemRequest) => {
    setOrders(Orders);
    setPage("add");
  };
  const {
    isLoading,
    data: OrdersList,
    isSuccess,
    isError,
  } = useGetAllitemrequestsQuery("api/procurements");

  // search bar coding
  const [searchInput, setSearchInput] = useState<string>("");

  const isLogged = getItem(RoutePaths.token);
  const user = !isLogged ? null : JSON.parse(getItem("user") || "");

  const [data, setData] = useState(user);

  let content: React.ReactNode;
  let count = 0;

  const filteredOrdersByCompany = OrdersList?.content?.filter(
    (order: ItemRequest) => order?.companyId === data.companyId
  );

  const filteredOrdersByStatus = filteredOrdersByCompany?.filter(
    (order: ItemRequest) => order?.status === "DISAPPROVED"
  );

  // Filter products based on the search input
  const filteredOrders = filteredOrdersByStatus.filter(
    (order: ItemRequest) =>
      order.siteId.toLowerCase().includes(searchInput.toLowerCase()) ||
      order.status.toLowerCase().includes(searchInput.toLowerCase())
  );

  content =
    isLoading || isError
      ? null
      : isSuccess
      ? filteredOrders?.map((Orders: ItemRequest) => {
          return (
            <tr className="p-3" key={Orders._id}>
              <td scope="row w-25">{++count}</td>
              <td>{Orders._id}</td>
              <td>{Orders.supplierId}</td>
              <td>{Orders.itemId}</td>
              <td>{Orders.siteId}</td>
              <td>{Orders.qty}</td>
              <td>
                <span
                  style={{
                    color: Orders.status === "APPROVED" ? "green" : "red",
                  }}
                >
                  {Orders?.status}
                </span>
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
          placeholder="Search Orders"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-default text-center table-bordered">
          <thead>
            <tr className="fd-bg-primary text-white">
              <th scope="col" className="p-3">
                No.
              </th>
              <th scope="col" className="p-3">
                Order ID
              </th>
              <th scope="col" className="p-3">
                Suplier ID
              </th>
              <th scope="col" className="p-3">
                ITEM ID
              </th>
              <th scope="col" className="p-3">
                SITE ID
              </th>
              <th scope="col" className="p-3">
                QTY
              </th>
              <th scope="col" className="p-3">
                STATUS
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

const DisApprovedOrdersMain = () => {
  const [page, setPage] = useState("list");
  const [currentOrder, setCurrentOrder] = useState(null);

  const changeToAdd = () => {
    setPage("list");
  };

  return (
    <div className="text-black">
      <h4 className="fw-bold">Approved Orders</h4>
      <div className="subPartMain">
        <ListOfOrders setOrders={setCurrentOrder} setPage={setPage} />
      </div>
    </div>
  );
};

export default DisApprovedOrdersMain;
