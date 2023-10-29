import React, { useState, SyntheticEvent } from "react";
import Swal from "sweetalert2";
import Spinner from "../Spinner";
import { HandleResult } from "../HandleResult";
import { ToastContainer, toast } from "react-toastify";
import {
  useGetAllapprovalsQuery,
  usePassApprovalMutation,
} from "../../store/apiquery/ApprovalsApiSlice";
import { Approval } from "../../types";
import { getItem } from "../../Utils/Generals";
import RoutePaths from "../../config";
import { useGetAllUsersQuery } from "../../store/apiquery/usersApiSlice";

const UpdateOrders = ({ itemRequest }: { itemRequest: Approval }) => {
  const [updateData, setUpdateData] = useState(itemRequest);
  const [updateOrders, udpateResult] = usePassApprovalMutation();

  const [formData, setFormData] = useState({
    refferredTo: "",
    description: "",
  });

  const isLogged = getItem(RoutePaths.token);
  const user = !isLogged ? null : JSON.parse(getItem("user") || "");

  const [data, setData] = useState(user);

  const {
    isLoading,
    data: usersList,
    isSuccess,
    isError,
  } = useGetAllUsersQuery("api/users");

  const siteAdmins = usersList?.content.filter((user: any) => {
    return (
      (user.roles.includes("SITE_ADMIN") ||
        user.roles.includes("PROCUREMENT_ADMIN")) &&
      user.companyId === data.companyId
    );
  });

  const [passApproval, passApprovalResult] = usePassApprovalMutation();

  const handleUpdateValue = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await passApproval({
        id: itemRequest._id,
        isApproved: true,
        formData,
      });

      if ("data" in result && result.data) {
        console.log("Item request approved successfully");
      } else if ("error" in result && result.error) {
        console.error("Item request approval failed", result.error);
      }
    } catch (error) {
      console.error("Item request approval failed", error);
    }
  };

  const handleDisapprove = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await passApproval({
        id: itemRequest._id,
        isApproved: false,
      });

      if ("data" in result && result.data) {
        console.log("Item request disapproved successfully");
      } else if ("error" in result && result.error) {
        console.error("Item request disapproval failed", result.error);
      }
    } catch (error) {
      console.error("Item request disapproval failed", error);
    }
  };

  const handleapprove = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await passApproval({
        id: itemRequest._id,
        isApproved: true,
      });

      if ("data" in result && result.data) {
        console.log("Item request approved successfully");
      } else if ("error" in result && result.error) {
        console.error("Item request approval failed", result.error);
      }
    } catch (error) {
      console.error("Item request approval failed", error);
    }
  };

  return (
    <div className="item-request-detail">
      <h2>Item Request Details</h2>
      <div>
        <p>Item Request ID: {itemRequest._id}</p>
        <p>Company ID: {itemRequest.companyId}</p>
        <p>Procument ID: {itemRequest.procurementId}</p>
        <p>Status: {itemRequest.status}</p>
        {/* Display other item request details here */}
      </div>

      <form action="" method="patch" className="checkout-service p-3">
        <input type="hidden" name="id" value={updateData._id} />
        <h3>Approval</h3>

        <label className="w-100">
          <span>Referred To</span>
          <select
            name="refferredTo"
            value={formData.refferredTo}
            className="form-control w-100 rounded-0 p-2"
            onChange={handleUpdateValue}
          >
            <option value="">Select User ID</option>
            {siteAdmins?.map((user: any) => (
              <option key={user._id} value={user._id}>
                {user.firstName}:{user._id}
              </option>
            ))}
          </select>
        </label>

        <label className="w-100">
          <span>Description</span>
          <input
            type="text"
            name="description"
            value={formData.description}
            className="form-control w-100 rounded-0 p-2"
            placeholder="Description"
            onChange={handleUpdateValue}
          />
        </label>
        <div className="mt-4">
          <ToastContainer />
        </div>
        <div className="mt-3">
          {udpateResult.isLoading ? (
            <button className="fd-btn w-25 text-center border-0">
              <span
                className="spinner-grow spinner-grow-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </button>
          ) : (
            <div>
              <button
                className="fd-btn w-25 text-center border-0"
                onClick={handleApprove}
              >
                Partially Approve
              </button>
              <br></br>
              <button
                className="fd-btn w-25 text-center border-0"
                style={{ background: "red" }}
                onClick={handleDisapprove}
              >
                Disapprove
              </button>
              <br></br>
              <button
                className="fd-btn w-25 text-center border-0"
                style={{ background: "green" }}
                onClick={handleapprove}
              >
                Approve
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

const ListOfOrders = ({
  setOrders,
  setPage,
}: {
  setOrders: Function;
  setPage: Function;
}) => {
  const parseOrders = (Orders: Approval) => {
    setOrders(Orders);
    setPage("add");
  };
  const {
    isLoading,
    data: OrdersList,
    isSuccess,
    isError,
  } = useGetAllapprovalsQuery("api/approvels");

  console.log("list", OrdersList);

  const isLogged = getItem(RoutePaths.token);
  const user = !isLogged ? null : JSON.parse(getItem("user") || "");

  const [data, setData] = useState(user);

  // search bar coding
  const [searchInput, setSearchInput] = useState<string>("");

  let content: React.ReactNode;
  let count = 0;

  const filteredOrdersByCompany = OrdersList?.content?.filter(
    (order: Approval) => order?.companyId === data.companyId
  );

  const filteredOrdersByStatus = filteredOrdersByCompany?.filter(
    (order: Approval) => order?.status === "PENDING"
  );

  // Filter products based on the search input
  const filteredOrders = filteredOrdersByStatus?.filter(
    (order: Approval) =>
      order.companyId.toLowerCase().includes(searchInput.toLowerCase()) ||
      order.status.toLowerCase().includes(searchInput.toLowerCase())
  );

  content =
    isLoading || isError
      ? null
      : isSuccess
      ? filteredOrders.map((Orders: Approval) => {
          return (
            <tr className="p-3" key={Orders._id}>
              <td scope="row w-25">{++count}</td>
              <td>{Orders._id}</td>
              <td>{Orders.companyId}</td>
              <td>{Orders.procurementId}</td>
              <td>
                <span
                  style={{
                    color: Orders.status === "APPROVED" ? "green" : "red",
                  }}
                >
                  {Orders?.status}
                </span>
              </td>
              <td className="fw-bold d-flex gap-2 justify-content-center">
                <a
                  href="#"
                  className="p-2 rounded-2 bg-secondary"
                  onClick={(e) => parseOrders(Orders)}
                  title="Edit"
                >
                  <i className="bi bi-pen"></i>
                </a>
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
                Company ID
              </th>
              <th scope="col" className="p-3">
                Procurement ID
              </th>
              <th scope="col" className="p-3">
                STATUS
              </th>
              <th scope="col">MANAGE</th>
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

const OrdersMain = () => {
  const [page, setPage] = useState("list");
  const [currentOrder, setCurrentOrder] = useState(null);

  const changeToAdd = () => {
    setPage("list");
  };

  return (
    <div className="text-black">
      <h4 className="fw-bold">Orders</h4>
      <div className="add-product my-3 d-flex justify-content-end">
        {
          <a
            href="#"
            className="fd-btn bg-secondary w-25 text-center rounded-3"
            onClick={changeToAdd}
          >
            ORDER LIST
          </a>
        }
      </div>
      <div className="subPartMain">
        {page === "list" ? (
          <ListOfOrders setOrders={setCurrentOrder} setPage={setPage} />
        ) : currentOrder ? ( // Check if currentOrder is not null
          <UpdateOrders itemRequest={currentOrder} />
        ) : null}
      </div>
    </div>
  );
};

export default OrdersMain;
