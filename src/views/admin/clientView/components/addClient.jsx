import React, { useState } from "react";
import Card from "components/card";
import axios from "axios";

const AddClient = () => {
  const [clientData, setClientData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const addClient = async (e) => {
    e.preventDefault();
    try {
      // Make the POST request to your FastAPI backend
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}add-client`,
        clientData
      );
      console.log("Client added successfully:", response.data);
      setSuccess("Client added successfully!"); // Show success message
    } catch (error) {
      console.error("Error adding client:", error);
      setError("Error adding client. Please try again."); // Show error message
    }
  };

  const handleReset = () => {
    // Reset the input fields
    setClientData({
      name: "",
      phone: "",
      email: "",
      address: "",
    });
    setSuccess("");
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-1">
      <Card extra="w-full pb-10 p-4 h-full">
        <header className="relative flex items-center justify-between">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Add New Client
          </div>
        </header>

        <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
          <div className="w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
            <p className="mb-9 ml-1 text-base text-gray-600">
              Enter the client details below
            </p>

            {error && <p className="mb-4 text-red-500">{error}</p>}
            {success && <p className="mb-4 text-green-500">{success}</p>}

            <form onSubmit={addClient}>
              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Client Name*
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter client's name"
                  required
                  value={clientData.name}
                  onChange={handleChange}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone*
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="Enter mobile number"
                  required
                  value={clientData.phone}
                  onChange={handleChange}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter email"
                  required
                  value={clientData.email}
                  onChange={handleChange}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address (optional)*
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Enter address"
                  // required
                  value={clientData.address}
                  onChange={handleChange}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Whatsapp (optional)*
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  placeholder="Enter address"
                  // required
                  value={clientData.whatsapp}
                  onChange={handleChange}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                />
              </div>

              <div className="mb-4 flex items-center justify-between px-2">
                <button
                  type="submit"
                  className="linear mt-2 w-[45%] rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                >
                  ADD
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="linear mt-2 w-[45%] rounded-xl bg-gray-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-300 dark:active:bg-gray-200"
                >
                  RESET
                </button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddClient;
