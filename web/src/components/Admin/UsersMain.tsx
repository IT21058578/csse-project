import React, { useState, useEffect, useRef } from "react";
import { CreateUserDto } from "../../types";
import { useRegisterMutation } from "../../store/apiquery/AuthApiSlice";
import { useGetAllUsersQuery } from "../../store/apiquery/usersApiSlice";
import Swal from "sweetalert2";
import Spinner from "../Spinner";
import { ToastContainer, toast } from "react-toastify";
import { useGetAllcompaniesQuery } from "../../store/apiquery/CompaniesApiSlice";
import RoutePaths from "../../config";
import { getItem } from "../../Utils/Generals";
import { useGetAllsitesQuery } from "../../store/apiquery/SitesApiSlice";

const AddOrEdituser = ({ user }: { user: null | CreateUserDto }) => {
  const [createuser, result] = useRegisterMutation();

  const isLogged = getItem(RoutePaths.token);
  const users = !isLogged ? null : JSON.parse(getItem("user") || "");

  const [dataUser, setData] = useState(users);

  const {
    isLoading,
    data: companysList,
    isSuccess,
    isError,
  } = useGetAllcompaniesQuery("api/companies");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    region: "",
    country: "",
    password: "",
    companyId: "",
    roles: [""],
    siteID: "",
  });

  // const { data: sitesList } = useGetAllsitesQuery("api/sites");

  // const filteredSitesList = sitesList?.content?.filter(
  //   (site: any) => site.companyId === formData.companyId
  // );

  const handleValue = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "select-multiple" && e.target instanceof HTMLSelectElement) {
      // Cast the event target to HTMLSelectElement and get selected options
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({ ...formData, [name]: selectedOptions });
    } else {
      // Handle other input types as usual
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createuser(formData);

      if ("data" in result && result.data) {
        console.log("user created successfully");
        toast.success("user created successfully");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          region: "",
          country: "",
          password: "",
          companyId: "",
          roles: [""],
          siteID: "",
        });
      } else if ("error" in result && result.error) {
        console.error("user creation failed", result.error);
        toast.error("user creation failed");
      }
    } catch (error) {
      console.error("user creation failed`", error);
      toast.error("user creation failed");
    }
  };

  if (!user) {
    return (
      <form
        action=""
        method="post"
        className="checkout-service p-3 .form-user"
        onSubmit={handleSubmit}
      >
        <div className="d-flex gap-2">
          <label className="w-50">
            <span>First Name</span>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              className="form-control w-100 rounded-0 p-2"
              placeholder="First Name"
              onChange={handleValue}
            />
          </label>
        </div>
        <div className="d-grid grid-4 gap-2 mt-3">
          <label>
            <span>Last Name</span>
            <input
              type="text"
              step={0.1}
              name="lastName"
              value={formData.lastName}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Last Name"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Email</span>
            <input
              type="string"
              step={0.1}
              name="email"
              value={formData.email}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Email"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Region</span>
            <input
              type="text"
              name="region"
              value={formData.region}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Region"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Country</span>
            <input
              type="text"
              name="country"
              value={formData.country}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Country"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="text"
              name="password"
              value={formData.password}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Password"
              onChange={handleValue}
            />
          </label>
          {/* <label>
            <span>Roles</span>
            <input
              type="text"
              name="roles"
              value={formData.roles}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Roles"
              onChange={handleValue}
            />
          </label> */}
          {/* <label>
            <span>Company Id</span>
            <input
              type="text"
              name="companyId"
              value={formData.companyId}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Brand"
              onChange={handleValue}
            />
          </label> */}
          <label>
            <span>Company Id</span>
            <select
              name="companyId"
              value={formData.companyId}
              className="form-control w-100 rounded-0 p-2"
              onChange={handleValue}
            >
              <option value="">Select a Company</option>
              {isLoading ? (
                <option value="" disabled>
                  Loading...
                </option>
              ) : isError ? (
                <option value="" disabled>
                  Error loading companies
                </option>
              ) : isSuccess ? (
                companysList?.content.map((company: any) => (
                  <option key={company._id} value={company._id}>
                    {company.name} - {company._id}
                  </option>
                ))
              ) : null}
            </select>
          </label>
          <label>
            <span>Roles</span>
            <select
              name="roles"
              value={formData.roles}
              className="form-control w-100 rounded-0 p-2"
              onChange={handleValue}
              multiple
            >
              <option value="">Select a Role</option>
              {dataUser?.roles ? (
                dataUser.roles.includes("SYSTEM_ADMIN") ? (
                  <option value="COMPANY_ADMIN">COMPANY_ADMIN</option>
                ) : (
                  <>
                    <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
                    <option value="PROCUREMENT_ADMIN">PROCUREMENT_ADMIN</option>
                    <option value="COMPANY_ADMIN">COMPANY_ADMIN</option>
                    <option value="SITE_ADMIN">SITE_ADMIN</option>
                  </>
                )
              ) : (
                <option value="DEFAULT_ROLE">DEFAULT_ROLE</option>
              )}
            </select>
          </label>
        </div>
        <div className="mt-3">
          <ToastContainer />
        </div>
        <div className="mt-3">
          {result.isLoading ? (
            <button className="fd-btn w-25 text-center border-0">
              <span
                className="spinner-grow spinner-grow-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Loading...
            </button>
          ) : (
            <button className="fd-btn w-25 text-center border-0">
              SAVE NOW
            </button>
          )}
        </div>
      </form>
    );
  }
  return null;
};

const ListOfusers = ({
  setuser,
  setPage,
}: {
  setuser: Function;
  setPage: Function;
}) => {
  const {
    isLoading,
    data: usersList,
    isSuccess,
    isError,
  } = useGetAllUsersQuery("api/users");

  const parseuser = (user: CreateUserDto) => {
    setuser(user);
    setPage("add");
  };

  // search bar coding
  const [searchInput, setSearchInput] = useState<string>("");

  let content: React.ReactNode;

  // Filter users based on the search input
  const filteredusers = usersList?.content.filter((user: CreateUserDto) => {
    const username = user.firstName?.toLowerCase();
    const lastname = user.lastName?.toLowerCase();
    const search = searchInput.toLowerCase();

    return username?.includes(search) || lastname?.includes(search);
  });

  console.log("user main page", usersList);

  content =
    isLoading || isError
      ? null
      : isSuccess
      ? filteredusers.map((user: CreateUserDto) => {
          // ? sortusers.map((user: userType) => {

          return (
            <tr className="p-3" key={user.firstName}>
              <td className="fw-bold">{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.roles}</td>
              {/* <td className="fw-bold d-flex gap-2 justify-content-center">
                <a
                  href="#"
                  className="p-2 rounded-2 fd-bg-primary"
                  onClick={(e) => parseuser(user)}
                  title="View user"
                >
                  <i className="bi bi-eye"></i>
                </a>
              </td> */}
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
          placeholder="Search users"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div className="table-responsive">
        <table className="table table-default text-center table-bordered">
          <thead>
            <tr className="fd-bg-primary text-white">
              <th scope="col" className="p-3">
                FIRST NAME
              </th>
              <th scope="col" className="p-3">
                LAST NAME
              </th>
              <th scope="col" className="p-3">
                EMAIL
              </th>
              <th scope="col" className="p-3">
                ROLES
              </th>
              {/* <th scope="col" className="p-3">
                Actions
              </th> */}
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

const UserMain = () => {
  const [page, setPage] = useState("list");
  const [currentuser, setCurrentuser] = useState(null);

  const changeToList = () => {
    setPage("add");
    setCurrentuser(null);
  };
  const changeToAdd = () => {
    setPage("list");
  };

  useEffect(() => setPage("list"), []);

  return (
    <div className="text-black">
      <h4 className="fw-bold">users</h4>
      <div className="add-user my-3 d-flex justify-content-end">
        {page === "list" ? (
          <a
            href="#"
            className="fd-btn bg-secondary w-25 text-center rounded-3"
            onClick={changeToList}
          >
            ADD USER
          </a>
        ) : (
          <a
            href="#"
            className="fd-btn bg-secondary w-25 text-center rounded-3"
            onClick={changeToAdd}
          >
            USERS LIST
          </a>
        )}
      </div>
      <div className="subPartMain">
        {page === "list" ? (
          <ListOfusers setuser={setCurrentuser} setPage={setPage} />
        ) : (
          <AddOrEdituser user={currentuser} />
        )}
      </div>
    </div>
  );
};

export default UserMain;
