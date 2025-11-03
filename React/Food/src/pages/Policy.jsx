import React from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";

function Policy() {
  return (
    <>
      <div className="h-[716px] bg-gray-50 p-6 flex flex-col items-center dark:bg-gray-800 pb-24">
        {/* Page Title */}
        <motion.h1
          className="text-4xl font-bold text-gray-800 mt-2 mb-4 dark:text-green-400"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Policies & Terms
        </motion.h1>

        {/* Intro Text */}
        <p className="text-gray-600 text-center max-w-2xl mb-10 dark:text-blue-300">
          Please read our policies carefully. By using our services.
        </p>

        {/* Policies Section */}
        <div className="max-w-4xl w-full space-y-5">
          {/* Privacy Policy */}
          <div className="bg-white shadow-md rounded-2xl p-6 dark:bg-gray-900">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2 dark:text-green-300">
              🔒 Privacy Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We respect your privacy. Your personal details such as name,
              email, and phone number will never be shared with third parties
              without your consent. We only use your data to improve our
              services.
            </p>
          </div>

          {/* Terms of Service */}
          <div className="bg-white shadow-md rounded-2xl p-6 dark:bg-gray-900">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2 dark:text-green-300">
              📜 Terms of Service
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              By accessing our website, you agree not to misuse our services.
              All content and images belong to us and cannot be used without
              permission.
            </p>
          </div>

          {/* Refund Policy */}
          <div className="bg-white shadow-md rounded-2xl p-6 dark:bg-gray-900">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2 dark:text-green-300">
              💰 Refund & Cancellation Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Orders once confirmed cannot be cancelled. Refunds will only be
              processed in case of incorrect or damaged delivery within 24
              hours.
            </p>
          </div>

          {/* Delivery Policy */}
          <div className="bg-white shadow-md rounded-2xl p-6 dark:bg-gray-900">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2 dark:text-green-300">
              🚚 Delivery Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              We ensure timely delivery of fresh meals. However, delivery time
              may vary based on location and traffic conditions.
            </p>
          </div>
        </div>

        {/* Last Updated */}
        <div className="w-full text-center mt-4">
          <p className="text-gray-500 dark:text-blue-300 text-sm">
            Last Updated: <span className="font-medium">August 2025</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Policy;
