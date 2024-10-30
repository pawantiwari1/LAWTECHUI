import axios from "axios";
import Card from "components/card";
import spinnerSrc from "assets/img/spinner2.gif"
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const FileUpload = ({ caseDetails }) => {
  const { case_id, client_id } = caseDetails;
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [docType, setDocType] = useState("petition");

  // const spinnerSrc = "assets/img/spinner.gif";
  console.log(spinnerSrc)
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles([...files, ...newFiles]);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`uploaded_file`, file);
      //  const maxSize =  104857600 //100MB
      //  console.log(maxSize)
      //   if (file.size > maxSize){
      //     console.log();
      //     alert("file is bigger :" , file.name);
      //   }else{
      //     formData.append(`uploaded_file`, file); // files was used Use the same key name to represent the array of files
      //   }
        
        
      });
      setIsLoading(true);
      setMessage("Uploading file...");

      const res = await axios.post(
        // multi_file_upload
        `${process.env.REACT_APP_API_BASE_URL}upload-pdf1/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important header for file upload
            accept: "application/json",
          },
          onUploadProgress: (progressEvent) => {
            // Calculate the progress as a percentage
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
          params: {
            case_number: case_id,
            client_id,
            doc_type: docType,
            doc_desc: description,
          },
        }
      );
      // setMessage(`File uploaded successfully!`);
      // setMessage(`File uploaded successfully: ${res.data.fileName}`);
      const data = res?.data?.uploaded_files;
      setFiles([]);
      setDocType("petition");
      setDescription("");
      toast.success("Files uploaded successfully");
      setIsLoading(false)
      window.location.reload();
    } catch (error) {
      toast.error("Something went wrong. Unable to upload files.");
      setIsLoading(false)
    }
  };

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      {/* <!-- Upload Files Section --> */}
      <h1 class="text-2xl font-semibold text-gray-800">Upload Files to Case</h1>
      {/* <p class="mb-4 text-gray-600">Case Reference: {case_id} </p> */}

      <div class="mb-6 rounded-lg bg-white p-6 shadow-md">
        <form>
          <div class="mb-6">
            <label
              class="mb-2 block font-medium text-gray-700"
              for="file-upload"
            >
              Select Files:
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              class="block w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring"
              onChange={handleFileChange}
            />
          </div>

          <div class="mb-6">
            <label class="mb-2 block font-medium text-gray-700" for="doc-type">
              Document Type:
            </label>
            <select
              id="doc-type"
              class="block w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="petition">Petition Document</option>
              <option value="evidence">Supporting Evidence</option>
              <option value="statement">Witness Statement</option>
              <option value="fir">FIR</option>
              <option value="statement">Others</option>
            </select>
          </div>

          <div class="mb-6">
            <label
              class="mb-2 block font-medium text-gray-700"
              for="description"
            >
              Description:
            </label>
            <textarea
              id="description"
              rows="4"
              class="block w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="Provide a brief description of the document..."
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></textarea>
          </div>

          <div class="flex justify-end">
            <button
              type="button"
              class="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={handleSubmit} disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload files"}
              
                {/* Conditional rendering of the spinner */}
                {isLoading && (
                  <div>
                    <img src={spinnerSrc} alt="Loading..." />
                    <p>{uploadProgress}%</p>
                  </div>
                )}
                        {/* Upload Files */}
            </button>
            {/* {message && <p>{message}</p>} */}
          </div>
        </form>
      </div>
    </Card>
  );
};

export default FileUpload;
