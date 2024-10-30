import React, { useState, useEffect, Fragment } from "react";
import Card from "components/card";
import InputField from "components/fields/InputField";
import axios from "axios";
import Modal from "./components/Modal";

const RegisterCase = () => {
  const [clientNames, setClientNames] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");

  const [registrationNo, setRegistrationNo] = useState("");
  const [issuedTo, setIssuedTo] = useState("");
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [litigationType, setLitigationType] = useState("");
  const [courtName, setCourtName] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [filingNumber, setFilingNumber] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // const [caseData, setCaseData] = useState({
  //   name: '',
  //   phone: '',
  //   email: '',
  //   address: '',
  // });

  useEffect(() => {
    const fetchClientNames = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}clients`
        );
        // Assuming response.data is an array of client objects with id and name properties
        const clientData = response.data.map((client) => ({
          id: client.client_id,
          name: client.name,
        }));
        console.log(clientData);
        setClientNames(clientData);
      } catch (error) {
        console.error("Error fetching client names:", error);
      }
    };

    fetchClientNames();
  }, []);

  const handleClientNameChange = (e) => {
    if (e.target.value === "new") {
      setSelectedClientId("");
    } else {
      setSelectedClientId(e.target.value);
    }
  };

  const [caseType, setCaseType] = useState(null);
  const [status, setStatus] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default country code

  const [type, setType] = useState("");
  const [otherType, setOtherType] = useState("");
  const [titles, setTitles] = useState([""]);

  const handleTypeChange = (e) => {
    setType(e.target.value);
    if (e.target.value !== "Others") {
      setOtherType("");
    }
  };

  const handleTitleChange = (index, value) => {
    const newTitles = [...titles];
    newTitles[index] = value;
    setTitles(newTitles);
  };

  const addTitle = () => {
    setTitles([...titles, ""]);
  };

  const removeTitle = (index) => {
    const newTitles = titles.filter((_, i) => i !== index);
    setTitles(newTitles);
  };

  const handleSubmit = async (e) => {
    const caseData = {
      client_id: selectedClientId,
      casetype: caseType,
      registration_number: registrationNo,
      issued_to: issuedTo,
      title: [title], // Assuming title is an array in backend
      address: address,
      status: status,
      email: email,
      mobile: mobile,
      litigation_type: litigationType,
      court_name: courtName,
      case_number: caseNumber,
      filing_number: filingNumber,
    };

    e.preventDefault();
    console.log(caseData);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}register-case`,
        caseData
      );
      console.log("Case registered successfully:", response.data);
      setSuccess("Case registered successfully!");
      // Optionally reset form fields or show success message
    } catch (error) {
      console.error("Error registering case:", error);
      setError("Error adding case. Please try again.");
      // Handle error, show error message, etc.
    }
  };

  return (
    <div>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-1">
        <Fragment>
          <Card extra={"w-full pb-10 p-4 h-full"}>
            <header className="relative flex items-center justify-between">
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Add New Case
              </div>
            </header>

            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
              {/* Form section */}
              <div className="w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                <p className="mb-9 ml-1 text-base text-gray-600">
                  Enter the case details below
                </p>
                {error && <p className="mb-4 text-red-500">{error}</p>}
                {success && <p className="mb-4 text-green-500">{success}</p>}

                <form onSubmit={handleSubmit}>
                  {/* Client Name */}
                  <div className="mb-3">
                    <label
                      htmlFor="client-name"
                      className="mb-3 block text-sm font-medium text-gray-700"
                    >
                      Client Name*
                    </label>
                    <select
                      id="client-name"
                      className="mb-3 mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={selectedClientId}
                      onChange={handleClientNameChange}
                    >
                      <option value="">Select client name</option>
                      {clientNames.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                      {/* <option value="new">Add new client name</option> */}
                    </select>
                    {/* {clientNameInputVisible && (
                    <InputField
                      variant="auth"
                      extra="mt-3"
                      label="New Client Name*"
                      placeholder="Enter new client name"
                      id="new-client-name"
                      type="text"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                    />
                  )} */}
                  </div>

                  {/* Type */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Type*
                    </label>
                    <div className="mt-2 space-y-2">
                      {[
                        "Legal Notice",
                        "Legal Opinion",
                        "Misc/Other",
                        "Litigation/Arbitration",
                      ].map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            id={`type-${type}`}
                            name="type"
                            type="radio"
                            value={type}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            onChange={(e) => setCaseType(e.target.value)}
                          />
                          <label
                            htmlFor={`type-${type}`}
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {caseType == "Legal Notice" ? (
                    <>
                      <header className="relative flex items-center justify-between">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">
                          Legal Notice
                        </div>
                      </header>

                      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                        {/* Form section */}
                        <div className="w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                          <p className="mb-9 ml-1 text-base text-gray-600">
                            Enter the details below
                          </p>

                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-8">
                            {/* Registration No. */}
                            <div className="mb-3">
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Registration Number
                              </label>
                              <input
                                type="text"
                                id="registration-no"
                                placeholder="Enter registration Number"
                                value={registrationNo}
                                onChange={(e) =>
                                  setRegistrationNo(e.target.value)
                                }
                                className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                              />
                            </div>
                            {/* <InputField
              variant="auth"
              extra="mb-3"
              label="Registration No.*"
              placeholder="Enter registration number"
              id="registration-no"
              type="text"
            /> */}

                            {/* Issued To */}
                            <div className="mb-3">
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Issued To
                              </label>
                              <input
                                type="text"
                                id="issued-to"
                                placeholder="Enter issued to"
                                value={issuedTo}
                                onChange={(e) => setIssuedTo(e.target.value)}
                                className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                              />
                            </div>
                            {/* <InputField
              variant="auth"
              extra="mb-3"
              label="Issued To*"
              placeholder="Enter issued to"
              id="issued-to"
              type="text"
            /> */}

                            {/* Title */}
                            <div className="mb-3">
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Title
                              </label>
                              <input
                                type="text"
                                id="title"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                              />
                            </div>
                            {/* <InputField
              variant="auth"
              extra="mb-3"
              label="Title*"
              placeholder="Enter title"
              id="title"
              type="text"
            /> */}

                            {/* Address */}
                            <div className="mb-3">
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Address
                              </label>
                              <input
                                type="text"
                                id="address"
                                placeholder="Enter address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                              />
                            </div>
                            {/* <InputField
              variant="auth"
              extra="mb-3"
              label="Address*"
              placeholder="Enter address"
              id="address"
              type="text"
            /> */}

                            {/* Status */}
                            <div className="mb-3">
                              <label
                                htmlFor="status"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Status
                              </label>
                              <select
                                id="status"
                                className="mb-3 mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                              >
                                <option value="">Select status</option>
                                <option value="Active">Active</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Email
                              </label>
                              <input
                                type="email"
                                id="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                              />
                            </div>
                            {/* <InputField
              variant="auth"
              extra="mb-3 "
              label="Email*"
              placeholder="Enter email"
              id="email"
              type="email"
            /> */}

                            {/* Whatsapp */}
                            <div className="mb-3">
                              <label
                                htmlFor="whatsapp"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Whatsapp
                              </label>
                              <div className="flex">
                                <select
                                  id="country-code"
                                  className="mb-3 mr-2 mt-3 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                  value={countryCode}
                                  onChange={(e) =>
                                    setCountryCode(e.target.value)
                                  }
                                >
                                  <option value="+1">+1</option>
                                  <option value="+44">+44</option>
                                  <option value="+91">+91</option>
                                  {/* Add more country codes as needed */}
                                </select>
                                <input
                                  type="tel"
                                  id="whatsapp"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                  placeholder="Mobile number"
                                  value={mobile}
                                  onChange={(e) => setMobile(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Buttons */}
                          {/* <div className="mt-6 flex items-center justify-between px-2">
            <button className="linear w-[45%] rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
              SAVE
            </button>
            <button className="linear w-[45%] rounded-xl bg-gray-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-300 dark:active:bg-gray-200">
              RESET
            </button>
          </div> */}
                        </div>
                      </div>
                    </>
                  ) : null}

                  {caseType == "Legal Opinion" ? (
                    <>
                      <header className="relative flex items-center justify-between">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">
                          Legal Opinion
                        </div>
                      </header>

                      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                        {/* Form section */}
                        <div className="w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                          <p className="mb-9 ml-1 text-base text-gray-600">
                            Enter the details below
                          </p>

                          {/* Registration No. */}
                          <div className="mb-3">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Registration Number
                            </label>
                            <input
                              type="text"
                              id="registration-no"
                              placeholder="Enter registration Number"
                              value={registrationNo}
                              onChange={(e) =>
                                setRegistrationNo(e.target.value)
                              }
                              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                            />
                          </div>
                          {/* <InputField
            variant="auth"
            extra="mb-3"
            label="Registration No.*"
            placeholder="Enter registration number"
            id="registration-no"
            type="text"
          /> */}

                          {/* Title */}
                          <div className="mb-3">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Title
                            </label>
                            <input
                              type="text"
                              id="title"
                              placeholder="Enter title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                            />
                          </div>
                          {/* <InputField
            variant="auth"
            extra="mb-3"
            label="Title*"
            placeholder="Enter title"
            id="title"
            type="text"
          /> */}

                          {/* Status */}
                          <div className="mb-3">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Status
                            </label>
                            <select
                              id="status"
                              className="mb-3 mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option value="">Select status</option>
                              <option value="Active">Active</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>

                          {/* Buttons */}
                          {/* <div className="mt-6 flex items-center justify-between px-2">
            <button className="linear w-[45%] rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
              SAVE
            </button>
            <button className="linear w-[45%] rounded-xl bg-gray-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-300 dark:active:bg-gray-200">
              RESET
            </button>
          </div> */}
                        </div>
                      </div>
                    </>
                  ) : null}

                  {caseType == "Misc/Other" ? (
                    <>
                      <header className="relative flex items-center justify-between">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">
                          Miscellaneous & Others
                        </div>
                      </header>

                      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                        {/* Form section */}
                        <div className="w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                          <p className="mb-9 ml-1 text-base text-gray-600">
                            Enter the details below
                          </p>

                          {/* Registration No. */}
                          <div className="mb-3">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Registration Number
                            </label>
                            <input
                              type="text"
                              id="registration-no"
                              placeholder="Enter registration Number"
                              value={registrationNo}
                              onChange={(e) =>
                                setRegistrationNo(e.target.value)
                              }
                              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                            />
                          </div>
                          {/* <InputField
            variant="auth"
            extra="mb-3"
            label="Registration No.*"
            placeholder="Enter registration number"
            id="registration-no"
            type="text"
          /> */}

                          {/* Title */}
                          <div className="mb-3">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Title
                            </label>
                            <input
                              type="text"
                              id="title"
                              placeholder="Enter title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                            />
                          </div>
                          {/* <InputField
            variant="auth"
            extra="mb-3"
            label="Title*"
            placeholder="Enter title"
            id="title"
            type="text"
          /> */}

                          {/* Status */}
                          <div className="mb-3">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Status
                            </label>
                            <select
                              id="status"
                              className="mb-3 mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option value="">Select status</option>
                              <option value="Active">Active</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>
                          {/* Buttons */}
                          {/* <div className="mt-6 flex items-center justify-between px-2">
            <button className="linear w-[45%] rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
              SAVE
            </button>
            <button className="linear w-[45%] rounded-xl bg-gray-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-300 dark:active:bg-gray-200">
              RESET
            </button>
          </div> */}
                        </div>
                      </div>
                    </>
                  ) : null}

                  {caseType == "Litigation/Arbitration" ? (
                    <>
                      <header className="relative flex items-center justify-between">
                        <div className="text-xl font-bold text-navy-700 dark:text-white">
                          Litigation & Arbitrary
                        </div>
                      </header>

                      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                        {/* Form section */}
                        <div className="w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                          <p className="mb-9 ml-1 text-base text-gray-600">
                            Enter the details below
                          </p>

                          {/* Registration No. */}
                          <div className="mb-3">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Registration Number
                            </label>
                            <input
                              type="text"
                              id="registration-no"
                              placeholder="Enter registration Number"
                              value={registrationNo}
                              onChange={(e) =>
                                setRegistrationNo(e.target.value)
                              }
                              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                            />
                          </div>
                          {/* <InputField
            variant="auth"
            extra="mb-3"
            label="Registration No.*"
            placeholder="Enter registration number"
            id="registration-no"
            type="text"
          /> */}

                          {/* Type */}
                          <div className="mb-3">
                            <label className="mx-2 mb-3 block text-sm font-medium text-gray-700">
                              Type*
                            </label>
                            <div className="mx-2 flex items-center">
                              {["Civil", "Criminal", "Arbitrary", "Others"].map(
                                (option) => (
                                  <div
                                    key={option}
                                    className="mr-4 flex items-center"
                                  >
                                    <input
                                      id={`type-${option}`}
                                      name="type"
                                      type="radio"
                                      value={option}
                                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      checked={type === option}
                                      onChange={handleTypeChange}
                                    />
                                    <label
                                      htmlFor={`type-${option}`}
                                      className="ml-1 block text-sm font-medium text-gray-700"
                                    >
                                      {option}
                                    </label>
                                  </div>
                                )
                              )}
                              {type === "Others" && (
                                <div className="mb-3">
                                  {/* <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                   Other
                 </label> */}
                                  <input
                                    type="text"
                                    id="other-type"
                                    placeholder="Enter other type"
                                    value={otherType}
                                    onChange={(e) =>
                                      setOtherType(e.target.value)
                                    }
                                    className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Title */}

                          <div className="mb-3">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Title
                            </label>
                            <input
                              type="text"
                              id="title"
                              placeholder="Enter title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                            />
                          </div>

                          {/* Court */}
                          <div className="mb-3">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Court
                            </label>
                            <input
                              type="text"
                              id="court"
                              placeholder="Enter Court"
                              value={courtName}
                              onChange={(e) => setCourtName(e.target.value)}
                              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                            />
                          </div>
                          {/* <InputField
            variant="auth"
            extra="mb-3"
            label="Court*"
            placeholder="Enter court"
            id="court"
            type="text"
          /> */}

                          {/* Case Number */}
                          <div className="mb-3">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Case Number
                            </label>
                            <input
                              type="text"
                              id="case-number"
                              placeholder="Enter Case Number"
                              value={caseNumber}
                              onChange={(e) => setCaseNumber(e.target.value)}
                              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                            />
                          </div>
                          {/* <InputField
            variant="auth"
            extra="mb-3"
            label="Case Number*"
            placeholder="Enter case number"
            id="case-number"
            type="text"
          /> */}

                          {/* Filing Number */}
                          <div className="mb-3">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Filing Number
                            </label>
                            <input
                              type="text"
                              id="filing-number"
                              placeholder="Enter Filing Number"
                              value={filingNumber}
                              onChange={(e) => setFilingNumber(e.target.value)}
                              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                            />
                          </div>
                          {/* <InputField
            variant="auth"
            extra="mb-3"
            label="Filing Number*"
            placeholder="Enter filing number"
            id="filing-number"
            type="text"
          /> */}

                          {/* Status */}
                          <div className="mb-3">
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Status
                            </label>
                            <select
                              id="status"
                              className="mb-3 mt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option value="">Select status</option>
                              <option value="Active">Active</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>
                          {/* Buttons */}
                          {/* <div className="mt-6 flex items-center justify-between px-2">
            <button className="linear w-[45%] rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
              SAVE
            </button>
            <button className="linear w-[45%] rounded-xl bg-gray-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-300 dark:active:bg-gray-200">
              RESET
            </button>
          </div> */}
                        </div>
                      </div>
                    </>
                  ) : null}

                  {/* Buttons */}
                  <div className="mb-4 flex items-center justify-between px-2">
                    <button
                      type="submit"
                      className="linear mt-2 w-[45%] rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                    >
                      SAVE
                    </button>
                    <button className="linear mt-2 w-[45%] rounded-xl bg-gray-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700 dark:bg-gray-400 dark:text-white dark:hover:bg-gray-300 dark:active:bg-gray-200">
                      RESET
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Card>
        </Fragment>
      </div>
    </div>
  );
};

export default RegisterCase;
