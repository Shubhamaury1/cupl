import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
function Policy() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <Link
          to="/"
          className="mt-4 px-6 py-3 bg-gray-500 text-white rounded-xl shadow-md hover:bg-gray-600 transition"
        >
          Go to Back
        </Link>
        {/* Title */}
        <motion.h1
          className="text-4xl font-bold text-gray-800 mt-12 mb-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Policies & Terms
        </motion.h1>
        <p className="text-gray-600 text-center max-w-2xl mb-10">
          Please read our policies carefully. By using our services, you agree
          to the following terms.
        </p>

        {/* Policies Section */}
        <div className="max-w-4xl w-full space-y-6">
          {/* Privacy Policy */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              🔒 Privacy Policy
            </h2>
            <p className="text-gray-600">
              We respect your privacy. Your personal details such as name,
              email, and phone number will never be shared with third parties
              without your consent. We only use your data to improve our
              services.
            </p>
          </div>

          {/* Terms of Service */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              📜 Terms of Service
            </h2>
            <p className="text-gray-600">
              By accessing our website, you agree not to misuse our services.
              All content and images belong to us and cannot be used without
              permission.
            </p>
          </div>

          {/* Refund Policy */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              💰 Refund & Cancellation Policy
            </h2>
            <p className="text-gray-600">
              Orders once confirmed cannot be cancelled. Refunds will only be
              processed in case of incorrect or damaged delivery within 24
              hours.
            </p>
          </div>

          {/* Delivery Policy (for food app) */}
          <div className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              🚚 Delivery Policy
            </h2>
            <p className="text-gray-600">
              We ensure timely delivery of fresh meals. However, delivery time
              may vary based on location and traffic conditions.
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <p className="mt-12 text-gray-500">Last Updated: August 2025</p>
      </div>
    </>
  );
}

export default Policy;
