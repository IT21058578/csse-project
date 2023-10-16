import React, { useState, useEffect, useRef } from "react";
import { CreateUserDto } from "../../types";
import { useRegisterMutation  } from "../../store/apiquery/AuthApiSlice";
import { useGetAllUsersQuery } from "../../store/apiquery/usersApiSlice";
import Swal from "sweetalert2";
import Spinner from "../Spinner";
import { ToastContainer, toast } from "react-toastify";


const AddOrEdituser = ({ user }: { user: null | CreateUserDto }) => {

  const [createuser, result] = useRegisterMutation();


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    region: '',
    country: '',
    password: '',
    roles: '',
    companyId: '',
  });

  const handleValue = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createuser({ formData });

      if ("data" in result && result.data) {
        console.log("user created successfully");
        toast.success("user created successfully");
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            region: '',
            country: '',
            password: '',
            roles: '',
            companyId: '',
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
              placeholder="user Name"
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
              placeholder="user Price"
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
              placeholder="Color"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Region</span>
            <input
              type="number"
              name="region"
              value={formData.region}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Quantity"
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
              placeholder="Brand"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="text"
              name="brand"
              value={formData.password}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Brand"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Roles</span>
            <input
              type="text"
              name="roles"
              value={formData.roles}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Brand"
              onChange={handleValue}
            />
          </label>
          <label>
            <span>Company Id</span>
            <input
              type="text"
              name="companyId"
              value={formData.companyId}
              className="form-control w-100 rounded-0 p-2"
              placeholder="Brand"
              onChange={handleValue}
            />
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
            <button
              className="fd-btn w-25 text-center border-0"
            >
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
  const [searchInput, setSearchInput] = useState<string>('');

  let content: React.ReactNode;

  // Filter users based on the search input
    const filteredusers = usersList?.content.filter((user: CreateUserDto) =>{
      const username = user.firstName?.toLowerCase();
      const lastname = user.lastName?.toLowerCase();
      const search = searchInput.toLowerCase();
    
  
      return (
        username?.includes(search) ||
        lastname?.includes(search)
      );
    });

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
              <td className="fw-bold">{user.region}</td>
              <td>{user.country}</td>
              <td>{user.roles}</td>
              <td className="fw-bold d-flex gap-2 justify-content-center">
                <a
                  href="#"
                  className="p-2 rounded-2 fd-bg-primary"
                  onClick={(e) => parseuser(user)}
                  title="View user"
                >
                  <i className="bi bi-eye"></i>
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
              REGION
            </th>
            <th scope="col" className="p-3">
              COUNTRY
            </th>
            <th scope="col" className="p-3">
              ROLES
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
