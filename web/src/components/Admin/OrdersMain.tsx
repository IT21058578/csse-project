import React, { useState, SyntheticEvent } from 'react'
import Swal from 'sweetalert2';
import Spinner from '../Spinner';
import { HandleResult } from '../HandleResult';
import { ToastContainer, toast } from "react-toastify";
import { useGetAllitemrequestsQuery , useGetitemrequestQuery} from '../../store/apiquery/ItemRequestApiSlice';
import { usePassApprovalMutation } from '../../store/apiquery/ApprovalsApiSlice';
import { ItemRequest } from '../../types';
import { Approval } from '../../types';


const UpdateOrders = ({itemRequest}: {itemRequest : ItemRequest}) => {

	const [updateData, setUpdateData] = useState(itemRequest);
	const [updateOrders, udpateResult] = usePassApprovalMutation();


  const [formData, setFormData] = useState({
    isApproved: false,
    refferredTo: '',
    description: '',
  });

  const [passApproval, passApprovalResult] = usePassApprovalMutation();


  const handleUpdateValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await passApproval({
        id: itemRequest._id,
        isApproved: true,
        refferredTo: '',
        description: formData.description,
      });

      if ('data' in result && result.data) {
        console.log('Item request approved successfully');
      } else if ('error' in result && result.error) {
        console.error('Item request approval failed', result.error);
      }
    } catch (error) {
      console.error('Item request approval failed', error);
    }
  };

  const handleDisapprove = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await passApproval({
        id: itemRequest._id,
        isApproved: false,
        refferredTo: '',
        description: formData.description,
      });

      if ('data' in result && result.data) {
        console.log('Item request disapproved successfully');
      } else if ('error' in result && result.error) {
        console.error('Item request disapproval failed', result.error);
      }
    } catch (error) {
      console.error('Item request disapproval failed', error);
    }
  };
  

	return (

    <div className="item-request-detail">
      <h2>Item Request Details</h2>
      <div>
        <p>Item Request ID: {itemRequest._id}</p>
        <p>Supplier ID: {itemRequest.supplierId}</p>
        <p>Item ID: {itemRequest.itemId}</p>
        <p>Site ID: {itemRequest.siteId}</p>
        <p>Quantity: {itemRequest.qty}</p>
        <p>Price: {itemRequest.price}</p>
        {/* Display other item request details here */}
      </div>

		<form action="" method="patch" className="checkout-service p-3">
			<input type="hidden" name="id" value={updateData._id} />
      <h3>Approval</h3>
      <div>
          <label className='w-100'>
            <input
              type="checkbox"
              name="isApproved"
              checked={formData.isApproved}
              onChange={handleUpdateValue}
            />{' '}
            Approve
          </label>
        </div>
        <label className='w-100'>
            <span>Refered To</span>
            <input type="text" name="refferredTo" value={formData.refferredTo} className="form-control w-100 rounded-0 p-2" placeholder='Orders Status' onChange={handleUpdateValue}/>
          </label>
          <label className='w-100'>
            <span>Description</span>
            <input type="text" name="description" value={formData.description} className="form-control w-100 rounded-0 p-2" placeholder='Orders Status' onChange={handleUpdateValue}/>
          </label>
        <div className="mt-4">
          <ToastContainer/>
        </div>
			<div className='mt-3'>{udpateResult.isLoading ?
				<button className="fd-btn w-25 text-center border-0"><span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
					Loading...</button> : 
          <div>
				<button className="fd-btn w-25 text-center border-0" onClick={handleApprove}>Approve</button>
        <button className="fd-btn w-25 text-center border-0" onClick={handleDisapprove}>Disapprove</button>
        </div>
			}</div>
		</form>

    </div>
	)


}

const ListOfOrders = ({ setOrders, setPage }: { setOrders: Function, setPage: Function }) => {

  const parseOrders = (Orders: ItemRequest) => {
    setOrders(Orders);
    setPage('add');
  }
  const { isLoading, data: OrdersList, isSuccess, isError } = useGetAllitemrequestsQuery('api/procurements');


  // search bar coding 
  const [searchInput, setSearchInput] = useState<string>('');

  let content: React.ReactNode;
  let count = 0;

  // Filter products based on the search input
  const filteredOrders = OrdersList?.content.filter((order: ItemRequest) =>
    order.siteId.toLowerCase().includes(searchInput.toLowerCase())
  );

  content = isLoading || isError
    ? null
    : isSuccess
      ? filteredOrders.map((Orders: ItemRequest) => {

        return (
          <tr className="p-3" key={Orders._id}>
            <td scope="row w-25">{++count}</td>
            <td>{Orders._id}</td>
            <td>{Orders.supplierId}</td>
            <td>{Orders.itemId}</td>
            <td>{Orders.siteId}</td>
            <td>{Orders.qty}</td>
            <td>
                  <span style={{ color: Orders.status === 'COMPLETED' ? 'green' : 'red' }}>
                                {Orders?.status}
                  </span>
            </td>
            <td className='fw-bold d-flex gap-2 justify-content-center'>
              <a href="#" className='p-2 rounded-2 bg-secondary' onClick={(e) => parseOrders(Orders)} title='Edit'><i className="bi bi-pen"></i></a>
            </td>
          </tr>
        )
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
          <tr className='fd-bg-primary text-white'>
            <th scope="col" className='p-3'>N°</th>
            <th scope="col" className='p-3'>Order ID</th>
            <th scope="col" className='p-3'>Suplier ID</th>
            <th scope="col" className='p-3'>DELIVERY STATUS</th>
            <th scope="col" className='p-3'>Item ID</th>
            <th scope="col" className='p-3'>Site ID</th>
            <th scope="col" className='p-3'>QTY</th>
            <th scope="col">MANAGE</th>
          </tr>
        </thead>
        <tbody>
          {
            content
          }
        </tbody>
      </table>
      </div>
    </div>) : (<Spinner />
  );
}

const OrdersMain = () => {
  const [page, setPage] = useState('list');
  const [currentOrder, setCurrentOrder] = useState(null);

  const changeToList = () => { setPage('add'); setCurrentOrder(null) }
  const changeToAdd = () => { setPage('list'); }

  return (
    <div className='text-black'>
      <h4 className="fw-bold">Orders</h4>
      <div className="add-product my-3 d-flex justify-content-end">
				{
					page === 'list' ?
						<a href="#" className="fd-btn bg-secondary w-25 text-center rounded-3" onClick={changeToList}>ORDER REPORS</a> :
						<a href="#" className="fd-btn bg-secondary w-25 text-center rounded-3" onClick={changeToAdd}>ORDER LIST</a>
				}
			</div>
			<div className="subPartMain">
      {page === 'list' ? (
  <ListOfOrders setOrders={setCurrentOrder} setPage={setPage} />
    ) : currentOrder ? ( // Check if currentOrder is not null
      <UpdateOrders itemRequest={currentOrder} />
    ) : null}
			</div>
    </div>
  )
}

export default OrdersMain