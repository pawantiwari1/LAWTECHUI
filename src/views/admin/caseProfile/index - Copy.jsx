import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "components/card";
import axios from 'axios';
import {
    MdDelete,
    MdEditNote,
    MdPreview,
  } from "react-icons/md";

const CaseProfile = () => {
  const { case_id } = useParams();
  const [caseDetails, setCaseDetails] = useState({});
  const [clientName, setClientName] = useState('');
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}registered-case/${case_id}`);
        const caseData = response.data;
        setCaseDetails(caseData);

        // Fetch client details using client_id
        if (caseData.client_id) {
          const clientResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}client/${caseData.client_id}`);
          setClientName(clientResponse.data.name);
        }
      } catch (error) {
        setError('Failed to fetch case or client details.');
        console.error(error);
      }
    };
    fetchCaseDetails();
  }, [case_id]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles([...files, ...newFiles]);
  };

  const handleFileUpload = () => {
    // Logic to handle file upload to the backend can be added here
    console.log('Files to be uploaded:', files);
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files);
    }
  };

  const handleFileSelect = (file) => {
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter(f => f !== file));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-1">
      <Card extra={"w-full pb-10 p-4 h-full"}>
        <header className="relative flex items-center justify-between">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Case Details
          </div>
        </header>
        <div className="grid grid-cols-2 gap-4 p-4">
          {clientName && (
            <div>
              <div className="text-sm font-bold text-gray-600">Client Name:</div>
              <div className="text-sm font-bold text-navy-700 dark:text-white">{clientName}</div>
            </div>
          )}
          {Object.entries(caseDetails).map(([key, value]) => (
            key !== 'case_id' && key !== 'client_id' && value && (
              <div key={key}>
                <div className="text-sm font-bold text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</div>
                <div className="text-sm font-bold text-navy-700 dark:text-white">{value}</div>
              </div>
            )
          ))}
        </div>
      </Card>

      <Card extra={"w-full pb-10 p-4 h-full"}>
      <div className="text-xl font-bold text-navy-700 dark:text-white">
            Files
          </div>
        <header className="relative flex items-center justify-center">

        </header>
        <div className="flex justify-center mt-4">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload
          </label>
        </div>

        {files.length > 0 && (
          <>
            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                      <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                        <input
                          type="checkbox"
                          checked={selectedFiles.length === files.length}
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                      <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                        Uploaded File Name
                      </div>
                    </th>
                    <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                      <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                        Category
                      </div>
                    </th>
                    <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                      <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                        Type
                      </div>
                    </th>
                    <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                      <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                        Status
                      </div>
                    </th>
                    <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                      <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr key={index}>
                      <td className="pt-[14px] pb-[20px] sm:text-[14px] text-sm font-bold text-navy-700 dark:text-white">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file)}
                          onChange={() => handleFileSelect(file)}
                        />
                      </td>
                      <td className="pt-[14px] pb-[20px] sm:text-[14px] text-sm font-bold text-navy-700 dark:text-white">
                        {file.name}
                      </td>
                      <td className="pt-[14px] pb-[20px] sm:text-[14px] text-sm font-bold text-navy-700 dark:text-white">
                        {/* Logic to determine category */}
                        Category
                      </td>
                      <td className="pt-[14px] pb-[20px] sm:text-[14px] text-sm font-bold text-navy-700 dark:text-white">
                        {file.type}
                      </td>
                      <td className="pt-[14px] pb-[20px] sm:text-[14px] text-sm font-bold text-navy-700 dark:text-white">
                        {/* Logic to determine status */}
                        Status
                      </td>
                      <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[18px]">
                        {/* Actions can be buttons or links */}
                        <button className="text-red-600 px-2"><MdDelete/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-6 space-x-3">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Chat</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">View LODE</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">View LOD</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Download</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default CaseProfile;
