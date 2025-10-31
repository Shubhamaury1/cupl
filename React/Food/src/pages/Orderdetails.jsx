import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import logo from "../assets/chef.png";

const APP_URL = import.meta.env.VITE_LOCAL_URL;
const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

function OrderDetails() {
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${APP_URL}/OrdersControllers/order/${id}`
        );
        if (response.status === 200) setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (!order)
    return <p className="p-8 text-gray-800">No order details available.</p>;

  const addressFields = order.address.split(",").reduce((acc, field) => {
    const [key, value] = field.split(":").map((item) => item.trim());
    if (key && value) acc[key] = value;
    return acc;
  }, {});

  const tracker =
    order.trackers && order.trackers.length > 0
      ? order.trackers[order.trackers.length - 1]
      : { status: "Confirmed", date: "20-09-2025" };

  const steps = [
    "Confirmed",
    "Dispatched",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];
  const currentStep = steps.indexOf(tracker.status);

  const downloadInvoice = () => {
    // check if order is exist or not
    if (!order) {
      console.log("Order data not available");
      return;
    }

    const doc = new jsPDF();

    // Add Company Name here
    doc.setFontSize(20);
    doc.text("AllDayEats", 20, 20);

    // Add a Title
    doc.setFontSize(18);
    doc.text("Invoice", 100, 20);

    // Add a logo
    const img = new Image();
    img.src = logo;
    doc.addImage(img, "png", 160, 10, 20, 20);

    // Invoice Information Section
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${order.id}`, 20, 35);
    doc.text(`Invoice Date: ${order.orderDate}`, 20, 40);

    // Format the payment method like in your JSX
    const formattedPaymentMethod = order.paymentMethod
      ? order.paymentMethod
          .replace(/([A-Z])/g, " $1") // Add space before capital letters
          .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      : "N/A";
    doc.text(`Payment Method: ${formattedPaymentMethod}`, 20, 45);

    //doc.text(`Payment Method: ${order.paymentMethod}`, 20, 45);
    doc.text(`Status: ${tracker.status}`, 150, 45);

    // Draw a line separating the section
    doc.line(20, 55, 190, 55);

    // Billing Address
    doc.setFontSize(14);
    doc.text("Billing Address:", 20, 65);
    doc.setFontSize(12);
    doc.text(`Name: ${addressFields["Name"]}`, 20, 70);
    doc.text(`Phone: ${addressFields["Phone"]}`, 20, 75);
    doc.text(`Address Type: ${addressFields["Type"]}`, 20, 80);
    doc.text(
      `Address: ${addressFields["House No"]}, ${addressFields["Landmark"]}, ${addressFields["City"]}, ${addressFields["Region"]} - ${addressFields["PinCode"]}`,
      20,
      85
    );

    // Draw a line separating the section
    doc.line(20, 90, 190, 90);

    // Shipping Address
    doc.setFontSize(14);
    doc.text("Shipping Address:", 20, 100);
    doc.setFontSize(12);
    doc.text(`Name: ${addressFields["Name"]}`, 20, 105);
    doc.text(`Phone: ${addressFields["Phone"]}`, 20, 110);
    doc.text(`Address Type: ${addressFields["Type"]}`, 20, 115);
    doc.text(
      `Address: ${addressFields["House No"]}, ${addressFields["Landmark"]}, ${addressFields["City"]}, ${addressFields["Region"]} - ${addressFields["PinCode"]}`,
      20,
      120
    );

    // Draw a line separating the section
    doc.line(20, 130, 190, 130);

    // Ordered Items Table Section
    doc.setFontSize(14);
    doc.text("Ordered Item(s):", 20, 140);

    doc.setFontSize(12);

    // Draw table header with background color and border
    const startY = 150;
    const headerHeight = 10;
    const rowHeight = 10;
    const colWidths = [90, 40, 40]; // Adjust column widths

    doc.setFillColor(200, 200, 200); // Light grey background for header
    doc.rect(20, startY, colWidths[0], headerHeight, "F"); // Product column
    doc.rect(110, startY, colWidths[1], headerHeight, "F"); // Quantity column
    doc.rect(150, startY, colWidths[2], headerHeight, "F"); // Price column

    // Set the header text
    doc.setTextColor(0, 0, 0); // Black text color
    doc.text("Product", 25, startY + 7);
    doc.text("Quantity", 115, startY + 7);
    doc.text("Price", 155, startY + 7);

    // Draw a border for the table header
    doc.rect(20, startY, 170, headerHeight);

    // Draw the product details rows
    let currentY = startY + headerHeight;
    doc.text(order.productName, 25, currentY + 7);
    doc.text(order.orderQuantity.toString(), 120, currentY + 7);
    doc.text(order.productPrice.toFixed(2), 155, currentY + 7);

    // Draw a border around the rows
    doc.rect(20, currentY, 170, rowHeight); // For one row

    // Draw a line separating the table from the total
    currentY += rowHeight;
    doc.line(20, currentY, 190, currentY);

    // Total Price Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Price: ${order.totalPrice.toFixed(2)}`, 20, currentY + 10); // Bold and formatted total price

    // Save the document with a dynamic filename
    doc.save(`Invoice_${order.id}.pdf`);
  };

  return (
    <div className="flex flex-col max-w-6xl mx-auto p-6 text-gray-800 min-h-screen bg-gray-50 dark:bg-gray-900 dark:shadow-md dark:shadow-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold border-b pb-2 dark:text-green-500">
          Order Details
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg dark:bg-blue-300 dark:text-white"
          >
            Back
          </button>
          <button
            onClick={downloadInvoice}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Download Invoice
          </button>
        </div>
      </div>

      {/* Order Tracker */}
      <section className="mb-8">
        <div className="flex justify-between items-center relative ">
          {steps.map((step, index) => {
            const isActive = index <= currentStep;
            return (
              <div
                key={index}
                className="flex-1 text-center relative dark:text-gray-500"
              >
                {/* Circle */}
                <div
                  className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    isActive
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-800"
                  }`}
                >
                  {isActive && <span>✓</span>}
                </div>
                <p
                  className={`text-sm dark:text-gray-800${
                    isActive ? "text-green-500" : "text-gray-800"
                  }`}
                >
                  {step}
                </p>
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-1/2 left-0 right-0 h-1 ${
                      index < currentStep ? "bg-green-500" : "bg-gray-300"
                    }`}
                    style={{
                      width: "calc(100% - 2rem)",
                      top: "25%",
                      left: "100%",
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Order Summary */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow dark:bg-blue-200">
        <h2 className="text-xl font-semibold mb-4 dark:text-green-600">
          Order Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
          <div>
            <p>
              <strong className="">Order Number:</strong> {order.id}
            </p>
            <p>
              <strong>Order Placed:</strong> {order.orderDate}
            </p>
            <p>
              <strong>Payment Method:</strong>{" "}
              {order.paymentMethod
                ? order.paymentMethod
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                : ""}
            </p>
          </div>
          <div>
            <p>
              <strong>Total:</strong> ₹{order.totalPrice}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="text-green-600">{tracker.status}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Address */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow dark:bg-pink-100">
        <h2 className="text-xl font-semibold mb-4 dark:text-green-600">
          Shipping Address
        </h2>
        <div className="text-gray-800 text-sm space-y-1">
          <p>
            <strong>Name:</strong> {addressFields["Name"]}
          </p>
          <p>
            <strong>Phone:</strong> {addressFields["Phone"]}
          </p>
          <p>
            <strong>Address Type:</strong> {addressFields["Type"]}
          </p>
          <p>
            <strong>Address:</strong> {addressFields["House No"]},{" "}
            {addressFields["Landmark"]}, {addressFields["City"]},{" "}
            {addressFields["Region"]}-{addressFields["PinCode"]}
          </p>
        </div>
      </section>

      {/* Ordered Item */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow dark:bg-orange-200">
        <h2 className="text-xl font-semibold mb-4 dark:text-green-600">
          Ordered Item
        </h2>
        <div className="flex items-center gap-4 border rounded-lg p-4 dark:shadow-lg dark:border-orange-200">
          <div className="flex-shrink-0">
            {order.imageUrl && (
              <img
                src={`${IMG_BASE_URL}` + order.imageUrl}
                //src={order.imageUrl}
                alt={order.productName}
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>
          <div className="text-gray-800 text-sm flex-1">
            <p className="font-semibold text-base dark:text-green-500">
              {order.productName}
            </p>
            <p className="dark:text-green-500">
              <strong>Quantity:</strong> {order.orderQuantity}
            </p>
            <p className="dark:text-green-500">
              <strong>Price:</strong> ₹{order.productPrice}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrderDetails;
