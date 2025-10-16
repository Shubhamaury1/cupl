import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const APP_URL = import.meta.env.VITE_LOCAL_URL;

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   toast.success("Message sent successfully! ✅");
  //   setFormData({ name: "", email: "", message: "" });
  // };

// handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${APP_URL}/contactform/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Message sent successfully! ✅");
        setFormData({ name: "", email: "", message: "" });
      } else {
        const data = await response.json();
        toast.error("Failed to send message: " + data.message);
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 dark:bg-gray-800">
      {/* Title */}
      <motion.h1
        className="text-4xl font-bold text-gray-800 mt-12 mb-4 dark:text-green-400"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Contact Us
      </motion.h1>

      <p className="text-gray-600 text-center max-w-2xl dark:text-purple-200">
        Have any questions, feedback, or suggestions? We’d love to hear from
        you!
      </p>

      {/* Contact Section */}
      <div className="grid md:grid-cols-2 gap-8 mt-12 w-full max-w-5xl  ">
        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 flex dark:bg-gray-900 flex-col gap-4 text-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-green-500 w-full bg-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-green-500 w-full bg-white"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-green-500 w-full bg-white"
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition w-full dark:bg-gray-600 "
          >
            Send Message
          </button>
        </motion.form>

        <Toaster position="top-center" reverseOrder={false} />

        {/* Contact Info */}
        <motion.div
          className="flex flex-col gap-6 justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-yellow-200">
              📍 Address
            </h2>
            <p className="text-gray-600 dark:text-orange-200">
              9/4 Food Street, Naini, Prayagraj, Uttar Pradesh, India
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-yellow-200">
              📞 Phone
            </h2>
            <p className="text-gray-600  dark:text-orange-200">
              +91 1234567890
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-yellow-200">
              ✉️ Email
            </h2>
            <p className="text-gray-600  dark:text-orange-200">
              food@gmail.com
            </p>
          </div>
          <div className="flex gap-4 mt-4 dark:font-bold">
            <a href="#" className="text-blue-600 hover:underline">
              Facebook
            </a>
            <a href="#" className="text-blue-400 hover:underline">
              Twitter
            </a>
            <a href="#" className="text-pink-600 hover:underline">
              Instagram
            </a>
          </div>
        </motion.div>
      </div>
      <Link
        to="/"
        className="m-8 px-6 py-3 bg-gray-500 text-white rounded-xl shadow-md hover:bg-gray-600 transition dark:bg-gray-900"
      >
        Go to Back
      </Link>
    </div>
  );
}

export default Contact;




// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";
// import emailjs from "emailjs-com"; // Import EmailJS SDK

// function Contact() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Update the handleSubmit function to send an email using EmailJS
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const emailParams = {
//       name: formData.name,
//       email: formData.email,
//       message: formData.message,
//     };

//     // Send the email using EmailJS
//     //send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", emailParams, "YOUR_PUBLIC_KEY_HERE")
//     emailjs
//       .send(
//         "service_z4x3itp",
//         "template_7h4pslk",
//         emailParams,
//         "Zv5d4L9d65k__Ec4v"
//       )
//       .then(
//         (response) => {
//           toast.success("Message sent successfully! ");
//           setFormData({ name: "", email: "", message: "" });
//         },
//         (error) => {
//           toast.error("Failed to send message. Please try again later. ");
//         }
//       );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 dark:bg-gray-800">
//       {/* Title */}
//       <motion.h1
//         className="text-4xl font-bold text-gray-800 mt-12 mb-4 dark:text-green-400"
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//       >
//         Contact Us
//       </motion.h1>

//       <p className="text-gray-600 text-center max-w-2xl dark:text-purple-200">
//         Have any questions, feedback, or suggestions? We’d love to hear from
//         you!
//       </p>

//       {/* Contact Section */}
//       <div className="grid md:grid-cols-2 gap-8 mt-12 w-full max-w-5xl">
//         {/* Contact Form */}
//         <motion.form
//           onSubmit={handleSubmit}
//           className="bg-white shadow-md rounded-2xl p-6 flex dark:bg-gray-900 flex-col gap-4"
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 0.8 }}
//         >
//           <input
//             type="text"
//             name="name"
//             placeholder="Your Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-green-500 w-full bg-white text-gray-800"
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Your Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-green-500 w-full bg-white text-gray-800"
//           />
//           <textarea
//             name="message"
//             placeholder="Your Message"
//             rows="4"
//             value={formData.message}
//             onChange={handleChange}
//             required
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-green-500 w-full bg-white text-gray-800"
//           ></textarea>
//           <button
//             type="submit"
//             className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition w-full dark:bg-gray-600"
//           >
//             Send Message
//           </button>
//         </motion.form>

//         <Toaster position="top-center" reverseOrder={false} />

//         {/* Contact Info */}
//         <motion.div
//           className="flex flex-col gap-6 justify-center"
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           transition={{ duration: 1 }}
//         >
//           <div>
//             <h2 className="text-xl font-semibold text-gray-700 dark:text-yellow-200">
//               📍 Address
//             </h2>
//             <p className="text-gray-600 dark:text-orange-200">
//               9/4 Food Street, Naini, Prayagraj, Uttar Pradesh, India
//             </p>
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold text-gray-700 dark:text-yellow-200">
//               📞 Phone
//             </h2>
//             <p className="text-gray-600 dark:text-orange-200">+91 1234567890</p>
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold text-gray-700 dark:text-yellow-200">
//               ✉️ Email
//             </h2>
//             <p className="text-gray-600 dark:text-orange-200">food@gmail.com</p>
//           </div>
//           <div className="flex gap-4 mt-4 dark:font-bold">
//             <a href="#" className="text-blue-600 hover:underline">
//               Facebook
//             </a>
//             <a href="#" className="text-blue-400 hover:underline">
//               Twitter
//             </a>
//             <a href="#" className="text-pink-600 hover:underline">
//               Instagram
//             </a>
//           </div>
//         </motion.div>
//       </div>
//       <Link
//         to="/"
//         className="m-8 px-6 py-3 bg-gray-500 text-white rounded-xl shadow-md hover:bg-gray-600 transition dark:bg-gray-900"
//       >
//         Go to Back
//       </Link>
//     </div>
//   );
// }

// export default Contact;
