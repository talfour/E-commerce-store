import React, {useEffect, useState} from 'react'
import { axiosInstance } from '../axios';
import Order from './Order';


const Orders = () => {

  const [orders, setOrders] = useState([]);
  const getOrderData = async () => {
    const response = await axiosInstance.get('orders/')
    if (response.status === 200) {
      console.log(response.data);
      setOrders(response.data)
    }
  }
  useEffect(() => {
    getOrderData()
  }, [])

  return (
    <div>
      <h1 className="text-center lg:text-5xl text-3xl pt-10 pb-10 font-roboto font-bold">Your orders</h1>
      <div>
        <Order orders={orders}></Order>
      </div>
    </div>
  )
}

export default Orders