import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const RiderRegistration = () => {
  const { user, checkAuth, setShowLoginModal } = useAuth();
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [formData, setFormData] = useState({
    vehicleType: '',
    vehicleNumber: '',
    licenseNumber: '',
    aadharNumber: '',
    bankAccount: '',
    ifscCode: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const vehicleTypes = ['Bike', 'Scooter', 'Bicycle', 'Car'];

  // Redirect if already a rider
  useEffect(() => {
    if (user && user.role === 'rider') {
      navigate('/rider/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.vehicleType) {
      toast.error('Please select a vehicle type');
      return;
    }

    if (!formData.vehicleNumber.trim()) {
      toast.error('Please enter your vehicle number');
      return;
    }

    if (!formData.licenseNumber.trim()) {
      toast.error('Please enter your license number');
      return;
    }

    if (!formData.aadharNumber.trim() || formData.aadharNumber.length !== 12) {
      toast.error('Please enter a valid 12-digit Aadhar number');
      return;
    }

    if (!formData.bankAccount.trim()) {
      toast.error('Please enter your bank account number');
      return;
    }

    if (!formData.ifscCode.trim() || formData.ifscCode.length !== 11) {
      toast.error('Please enter a valid 11-character IFSC code');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${SERVER_URL}/api/rider/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Successfully registered as a rider!');
        await checkAuth(); // Refresh user data
        navigate('/rider/dashboard');
      } else {
        toast.error(data.message || 'Failed to register as rider');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show login prompt if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please login to register as a rider with BigBite
          </p>
          <button
            onClick={() => {
              setShowLoginModal(true);
              navigate('/');
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login Now
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Become a Rider
          </h1>
          <p className="text-lg text-gray-600">
            Join <span className="text-blue-600 font-semibold">BigBite</span> and start earning
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vehicle Type <span className="text-red-500">*</span>
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              >
                <option value="">Select vehicle type</option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vehicle Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="e.g., MH12AB1234"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase"
                required
              />
            </div>

            {/* License Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Driving License Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="Enter your driving license number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase"
                required
              />
            </div>

            {/* Aadhar Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Aadhar Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                placeholder="Enter 12-digit Aadhar number"
                maxLength={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Your Aadhar number is securely encrypted and stored
              </p>
            </div>

            {/* Bank Account Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bank Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                placeholder="Enter your bank account number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="Enter 11-character IFSC code"
                maxLength={11}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase"
                required
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Important Information:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>All information will be verified before activation</li>
                    <li>Bank account details are required for earnings transfer</li>
                    <li>You can update your availability status after registration</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </>
              ) : (
                'Register as Rider'
              )}
            </button>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Rider Benefits</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <svg
                className="w-6 h-6 text-green-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Flexible Hours</p>
                <p className="text-sm text-gray-600">Work when you want</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg
                className="w-6 h-6 text-green-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Good Earnings</p>
                <p className="text-sm text-gray-600">Competitive delivery fees</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg
                className="w-6 h-6 text-green-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Weekly Payouts</p>
                <p className="text-sm text-gray-600">Regular payment transfers</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <svg
                className="w-6 h-6 text-green-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">24/7 Support</p>
                <p className="text-sm text-gray-600">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RiderRegistration;
