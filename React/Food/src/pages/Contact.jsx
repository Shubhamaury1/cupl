import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully! ✅");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Title */}
      <motion.h1
        className="text-4xl font-bold text-gray-800 mt-12 mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Contact Us
      </motion.h1>

      <p className="text-gray-600 text-center max-w-2xl">
        Have any questions, feedback, or suggestions? We’d love to hear from
        you!
      </p>

      {/* Contact Section */}
      <div className="grid md:grid-cols-2 gap-8 mt-12 w-full max-w-5xl">
        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-4 "
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
            className="border p-3 rounded-xl focus:ring-2 focus:ring-green-500 w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-green-500 w-full"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
            className="border p-3 rounded-xl focus:ring-2 focus:ring-green-500 w-full"
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition w-full"
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
            <h2 className="text-xl font-semibold text-gray-700">📍 Address</h2>
            <p className="text-gray-600">
              9/4 Food Street, Naini, Prayagraj, Uttar Pradesh, India
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700">📞 Phone</h2>
            <p className="text-gray-600">+91 1234567890</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700">✉️ Email</h2>
            <p className="text-gray-600">food@gmail.com</p>
          </div>
          <div className="flex gap-4 mt-4">
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
        className="m-8 px-6 py-3 bg-gray-500 text-white rounded-xl shadow-md hover:bg-gray-600 transition"
      >
        Go to Back
      </Link>

      {/* Map Section */}
      {/* <motion.div
        className="w-full max-w-5xl mt-12 rounded-2xl overflow-hidden shadow-md"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          title="location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.123!2d77.216721!3d28.644800!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd8c!2sConnaught%20Place%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v169324!"
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </motion.div> */}
    </div>
  );
}

export default Contact;
