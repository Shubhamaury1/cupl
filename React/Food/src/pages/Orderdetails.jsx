import React, { useEffect, useState } from "react";
import axios from "axios";
const APP_URL = import.meta.env.VITE_LOCAL_URL;
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

function OrderDetails() {
  const [order, setOrder] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      console.log("Order ID is missing.");
      return;
    }
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${APP_URL}/OrdersControllers/order/${id}`
        );
        if (response.status === 200) {
          //console.log("tracker", response.data);
          setOrder(response.data);
        } else {
          console.log("Failed to fetch order details.");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (!order) {
    return <p className="p-8 text-gray-700">No order details available.</p>;
  }
  // Parse the address string into separate components
  const addressFields = order.address.split(",").reduce((acc, field) => {
    const [key, value] = field.split(":").map((item) => item.trim());
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const tracker =
    order.trackers && order.trackers.length > 0
      ? order.trackers[order.trackers.length - 1]
      : { status: "Pending", date: "20-09-2025" };

  // Download invoice 
const downloadInvoice = () => {
  // check if order is exist or not
  if (!order) {
    console.log("Order data not available");
    return;
  }
  const doc = new jsPDF();
  // Adding the Title
  doc.setFontSize(20);
  doc.text("Invoice", 105, 20, null, null, "center");

  // Invoice Information Section
  doc.setFontSize(12);
  doc.text(`Invoice Number: ${order.id}`, 20, 40);
  doc.text(`Invoice Date: ${order.orderDate}`, 20, 50);
  doc.text(`Payment Method: Cash On Delivery`, 20, 60);
  doc.text(`Status: ${tracker.status}`, 150, 60);

  // Draw a line separate the section from the bill
  doc.line(20, 70, 190, 70);

  // Shipping Address
  doc.setFontSize(14);
  doc.text("Shipping Address:", 20, 80);
  doc.setFontSize(12);
  doc.text(`Name: ${addressFields["Name"]}`, 20, 90);
  doc.text(`Phone: ${addressFields["Phone"]}`, 20, 100);
  doc.text(`Address Type: ${addressFields["Type"]}`, 20, 110);
  doc.text(
    `Address: ${addressFields["House No"]}, ${addressFields["Landmark"]}, ${addressFields["City"]}, ${addressFields["Region"]} - ${addressFields["PinCode"]}`,
    20,
    120
  );

  // Draw a line separate the section from the bill
  doc.line(20, 130, 190, 130);

  // Ordered Item Section
  doc.setFontSize(14);
  doc.text("Ordered Item(s):", 20, 140);

  doc.setFontSize(12);
  // Draw table header of product
  doc.text("Product", 20, 150);
  doc.text("Quantity", 100, 150);
  doc.text("Price", 150, 150);

  // Draw a line separate the section from the bill
  doc.line(20, 155, 190, 155);

  doc.text(`${order.productName}`, 20, 160);
  doc.text(`${order.orderQuantity}`, 105, 160);
  doc.text(`${order.productPrice}`, 150, 160);
 
  // Total Paymebnt Section
  doc.text(`Total Price: ${order.totalPrice}`, 20, 175);

  // Save the document
  doc.save(`Invoice_${order.id}.pdf`);
};

  return (
    <div className=" flex flex-col max-w-4xl mx-auto p-6 text-gray-800 h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold border-b pb-2 dark:text-green-500">
          Order Details
        </h1>
        {tracker.status === "Delivered" && (
          <button
            onClick={downloadInvoice}
            type="button"
            className="text-white bg-blue-500 rounded-lg py-2 px-4"
          >
            Download Invoice
          </button>
        )}
      </div>

      {/* Order Summary */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-green-500">
          Order Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <strong className="dark:text-pink-200">Order Number:</strong>{" "}
              <span className="dark:text-white">{order.id}</span>
            </p>
            <p>
              <strong className="dark:text-pink-200">Order Placed:</strong>{" "}
              <span className="dark:text-white">{order.orderDate}</span>
            </p>
            <p>
              <strong className="dark:text-pink-200">Payment Method:</strong>{" "}
              <span className="dark:text-white"> Cash On Delivery</span>
            </p>
          </div>
          <div>
            <p>
              <strong className="dark:text-pink-200">Total:</strong> ₹
              <span className="dark:text-white">{order.totalPrice}</span>
            </p>
            <p>
              <strong className="dark:text-pink-200">Status:</strong>{" "}
              <span className="text-green-600 font-medium dark:text-blue-500">
                {tracker.status}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Address */}
      <section className="mb-6 bg-gray-50 p-4 rounded-lg shadow dark:bg-blue-100">
        <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
        <div className="text-sm">
          <p>
            <strong>Name:</strong> {addressFields["Name"]}
          </p>
          <p>
            <strong>Phone:</strong> {addressFields["Phone"]}
          </p>
          <p>
            <strong>Address Type:</strong> {addressFields["Type"]},{""}
          </p>
          <p>
            <strong>Address:</strong> {addressFields["House No"]},{" "}
            {addressFields["Landmark"]}, {addressFields["City"]},{" "}
            {addressFields["Region"]}-{addressFields["PinCode"]}
          </p>
        </div>
      </section>

      {/* Ordered Item */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 dark:text-green-500">
          Ordered Item
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 border rounded-lg p-4 shadow-sm bg-white dark:bg-orange-200">
            {/* Left side: Image */}
            <div className="flex-shrink-0">
              {order.imageUrl && (
                <img
                  src={order.imageUrl}
                  alt={order.productName}
                  className="w-32 h-32 object-cover rounded-lg" // Add rounded corners if desired
                />
              )}
            </div>

            {/* Right side: Order Details */}
            <div className="text-gray-700 font-medium flex-1 text-sm dark:text-green-600">
              <p className="font-semibold text-base">{order.productName}</p>
              <p>
                <span className="dark:font-bold">Quantity:</span>{" "}
                {order.orderQuantity}
              </p>
              <p>
                <span className="dark:font-bold">Price:</span> ₹
                {order.productPrice}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default OrderDetails;
