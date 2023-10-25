import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { Company } from "../../types";
import Spinner from "../Spinner";
import { ToastContainer, toast } from "react-toastify";
import {
  useGetAllcompaniesQuery,
  useCreatecompanieMutation,
  useDeletecompanieMutation,
  useUpdatecompanieMutation,
} from "../../store/apiquery/CompaniesApiSlice";

const Updatecompany = ({ company }: { company: Company }) => {
  const [updateData, setUpdateData] = useState(company);
  const [updatecompany, udpateResult] = useUpdatecompanieMutation();
  const imageTag = useRef<HTMLImageElement>(null);
  const companyId = company?._id;

  const [formData, setFormData] = useState({
    name: updateData.name,
  });

  const handleUpdateValue = (
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
      const result = await updatecompany({ companyId, formData });

      if ("data" in result && result.data) {
        console.log("company Updated successfully");
        toast.success("company Updated successfully");
        setFormData({
          name: "",
        });
      } else if ("error" in result && result.error) {
        console.error("company creation failed", result.error);
        toast.error("company creation failed");
      }
    } catch (error) {
      console.error("company creation failed`", error);
      toast.error("company creation failed");
    }
  };

  return (
    <form
      action=""
      method="patch"
      className="checkout-service p-3"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="id" value={updateData._id} />

      <div className="d-flex gap-2">
        <label className="w-50">
          <span>Name</span>
          <input
            type="text"
            name="name"
            className="form-control w-100 rounded-0 p-2"
            value={formData.name}
            onChange={handleUpdateValue}
          />
        </label>
      </div>
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
          <button className="fd-btn w-25 text-center border-0" type="submit">
            UPDATE company
          </button>
        )}
      </div>
    </form>
  );
};

const AddOrEditcompany = ({ company }: { company: null | Company }) => {
  const [createcompany, result] = useCreatecompanieMutation();

  const [formData, setFormData] = useState({
    name: "",
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
      const result = await createcompany({ formData });

      if ("data" in result && result.data) {
        console.log("company created successfully");
        toast.success("company created successfully");
        setFormData({
          name: "",
        });
      } else if ("error" in result && result.error) {
        console.error("company creation failed", result.error);
        toast.error("company creation failed");
      }
    } catch (error) {
      console.error("company creation failed`", error);
      toast.error("company creation failed");
    }
  };

  if (!company) {
    return (
      <form
        action=""
        method="post"
        className="checkout-service p-3 .form-company"
        onSubmit={handleSubmit}
      >
        <div className="d-flex gap-2">
          <label className="w-50">
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              className="form-control w-100 rounded-0 p-2"
              placeholder="company Name"
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
            <button className="fd-btn w-25 text-center border-0">
              SAVE NOW
            </button>
          )}
        </div>
      </form>
    );
  }

  return <Updatecompany company={company} />;
};

const ListOfcompanys = ({
  setcompany,
  setPage,
}: {
  setcompany: Function;
  setPage: Function;
}) => {
  const {
    isLoading,
    data: companysList,
    isSuccess,
    isError,
  } = useGetAllcompaniesQuery("api/companies");

  const [deletecompany, deletedResult] = useDeletecompanieMutation();

  let count = 0;

  const parsecompany = (company: Company) => {
    setcompany(company);
    setPage("add");
  };

  const deleteItem = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure to delete this company ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((r) => {
      if (r.isConfirmed) {
        deletecompany(id);
      }
    });
  };

  // search bar coding
  const [searchInput, setSearchInput] = useState<string>("");

  let content: React.ReactNode;

  // Filter companies based on the search input
  const filteredcompanys = companysList?.content.filter((company: Company) => {
    const companyname = company.name?.toLowerCase();
    const search = searchInput.toLowerCase();

    return companyname?.includes(search);
  });

  content =
    isLoading || isError
      ? null
      : isSuccess
      ? filteredcompanys.map((company: Company) => {
          return (
            <tr className="p-3" key={company._id}>
              <td scope="row w-25">{++count}</td>
              <td className="fw-bold">{company.name}</td>
              <td className="fw-bold d-flex gap-2 justify-content-center">
                <a
                  href="#"
                  className="p-2 rounded-2 fd-bg-primary"
                  onClick={(e) => parsecompany(company)}
                  title="View company"
                >
                  <i className="bi bi-eye"></i>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-2 bg-secondary"
                  onClick={(e) => parsecompany(company)}
                  title="Edit"
                >
                  <i className="bi bi-pen"></i>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-2 bg-danger"
                  title="Delete"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteItem(company._id);
                  }}
                >
                  <i className="bi bi-trash"></i>
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
          placeholder="Search companys"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div className="table-responsive">
        <table className="table table-default text-center table-bordered">
          <thead>
            <tr className="fd-bg-primary text-white">
              <th scope="col" className="p-3">
                No
              </th>
              <th scope="col" className="p-3">
                company NAME
              </th>
              <th scope="col" className="p-3">
                ACTION
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

const CompanyMain = () => {
  const [page, setPage] = useState("list");
  const [currentcompany, setCurrentcompany] = useState(null);

  const changeToList = () => {
    setPage("add");
    setCurrentcompany(null);
  };
  const changeToAdd = () => {
    setPage("list");
  };

  useEffect(() => setPage("list"), []);

  return (
    <div className="text-black">
      <h4 className="fw-bold">companies</h4>
      <div className="add-company my-3 d-flex justify-content-end">
        {page === "list" ? (
          <a
            href="#"
            className="fd-btn bg-secondary w-25 text-center rounded-3"
            onClick={changeToList}
          >
            ADD COMPANY
          </a>
        ) : (
          <a
            href="#"
            className="fd-btn bg-secondary w-25 text-center rounded-3"
            onClick={changeToAdd}
          >
            COMPANIES LIST
          </a>
        )}
      </div>
      <div className="subPartMain">
        {page === "list" ? (
          <ListOfcompanys setcompany={setCurrentcompany} setPage={setPage} />
        ) : (
          <AddOrEditcompany company={currentcompany} />
        )}
      </div>
    </div>
  );
};

export default CompanyMain;
