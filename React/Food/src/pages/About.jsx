import React from "react";
import { motion } from "framer-motion";
import {Link} from 'react-router-dom'
function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 dark:bg-gray-800">
      {/* Hero Section */}
      <motion.div
        className="max-w-3xl text-center mt-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4 dark:text-green-400">
          About Us
        </h1>
        <p className="text-lg text-gray-600 dark:text-purple-200">
          We are passionate about delivering delicious food and creating
          memorable dining experiences. Our goal is to bring happiness through
          every meal we serve.
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        className="grid md:grid-cols-2 gap-6 mt-12 max-w-4xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="bg-white shadow-md rounded-2xl p-6 dark:bg-orange-200">
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">
            Our Mission
          </h2>
          <p className="text-gray-600">
            To serve healthy, tasty, and affordable meals while promoting
            sustainable food practices.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 dark:bg-blue-200">
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">
            Our Vision
          </h2>
          <p className="text-gray-600">
            To be the go-to place for food lovers who value taste, quality, and
            community.
          </p>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl">
        <div className="bg-green-100 p-4 rounded-xl text-center">
          <h3 className="text-3xl font-bold text-green-700">50+</h3>
          <p className="text-gray-700">Dishes Served</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-xl text-center">
          <h3 className="text-3xl font-bold text-blue-700">1k+</h3>
          <p className="text-gray-700">Happy Customers</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl text-center">
          <h3 className="text-3xl font-bold text-yellow-700">2+</h3>
          <p className="text-gray-700">Years Experience</p>
        </div>
        <div className="bg-pink-100 p-4 rounded-xl text-center">
          <h3 className="text-3xl font-bold text-pink-700">50+</h3>
          <p className="text-gray-700">Team Members</p>
        </div>
      </div>

      {/* Call To Action */}
      <motion.div
        className="mt-12"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/contact"
          className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition"
        >
          Contact Us
        </Link>
        <Link
          to="/"
          className="ml-4 px-6 py-3 bg-gray-500 text-white rounded-xl shadow-md hover:bg-gray-600 transition"
        >
          Go to Back
        </Link>
      </motion.div>
    </div>
  );
}

export default About;
