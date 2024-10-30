import React, { useState } from "react";
import Card from "components/card";
import axios from "axios";

const TotalSpent = ({ icon }) => {
  const [uploadedPdf, setUploadedPdf] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setSelectedFileName(file ? file.name : "");
  };

  const handleUpload = () => {
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    const newPdf = {
      name: selectedFile.name,
      url: URL.createObjectURL(selectedFile),
      totalPages: 5, // Replace with actual number of pages
    };
    setUploadedPdf(newPdf);
  };

  const pdfSubmit = async () => {
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("uploaded_file", selectedFile);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}upload-pdf/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the Content-Type header
          },
        }
      );
      // Handle success response - you can set state or do any other action here
      console.log(response.data);
    } catch (error) {
      // Handle error
      console.error("Error uploading PDF:", error);
    }
  };

  const handleSubUpload = () => {
    handleUpload();
    pdfSubmit();
  };

  return (
    <Card extra="!p-[20px] text-center">
      <div className="flex items-center">
        <div className="ml-[18px] rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
          <span className="flex items-center text-brand-500 dark:text-white">
            {icon}
          </span>
        </div>
        <div className="flex items-center">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer rounded-md border border-blue-500 px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
          >
            Choose File
          </label>
          <span className="ml-2">{selectedFileName}</span>
          <button
            onClick={handleSubUpload}
            className="ml-2 rounded-md border border-blue-500 px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
          >
            Upload
          </button>
        </div>
      </div>
      {uploadedPdf && (
        <div className="mt-4">
          <div>
            <span>{uploadedPdf.name}</span>
          </div>
          <div className="mt-4 flex h-full w-full flex-col items-center">
            <iframe
              src={uploadedPdf.url}
              width="100%"
              height="500px"
              title="PDF Preview"
            ></iframe>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TotalSpent;
