import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { SingleDocumentChat } from "./SingleDocumentChat";
import "./chatpopup.css";
const RecentUploadedDocuments = ({ caseDetails }) => {
    const { case_id, client_id, registration_number } = caseDetails;
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentDocumentDetails, setCurrentDocumentDetails] = useState("");


    useEffect(() => {
        const getUploadedDocuments = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}list_files`,
                    {
                        params: {
                            case_number: case_id,
                            client_id,
                            registration_number,
                        },
                    }
                );
                const data = res.data.file_list || [];
                setUploadedDocuments(data);
            } catch (error) {
                toast.error("Unable to fetch uploaded documents");
            }
        };
        getUploadedDocuments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [caseDetails]);


    const handleDelete = async (docId) => {
        try {
            const res = await axios.delete(
                `${process.env.REACT_APP_API_BASE_URL}delete_files`,
                {
                    params: {
                        case_number: case_id,
                        client_id,
                        registration_number,
                        doc_id: docId,
                    },
                }
            );
            // console.log(res)
            // const data = res?.data?.file_delete;
            const data = res.data.file_delete;

            if (data && data.status === "deleted") {
                // console.log("delete id" , docId);
                const updatedUploadedDocuments = uploadedDocuments.filter(
                    (uploadedDocuments) => uploadedDocuments.document_id !== docId

                );
                setUploadedDocuments(updatedUploadedDocuments);
                toast.success("Document deleted successfully");
                window.location.reload();
            } else {
                toast.error("Unable to delete document");
            }
        } catch (error) {
            toast.error("Unable to delete document");
        }
    };

    const handletToAssignDocTypeAndNaturOfDoc = (dockDetails) => {
        try {
            setCurrentDocumentDetails(dockDetails);
            setIsPopupOpen(true);
        } catch (error) {
            console.log(error);
        }
    }

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const handletToProcessDoc = (docId) => {

    }


    return (
        <card extra={"w-full pb-10 p-4 h-full"}>
            {/* <!-- Title Section --> */}
            <div class="mb-6 rounded-lg bg-white p-6 shadow-md">
                <h1 class="text-2xl font-semibold text-gray-800">
                    Recent Uploaded Documents
                </h1>
                {/* <p class="text-gray-600">Case Reference: XYZ123 - Document Overview</p> */}

                <br></br>

                <table class="w-full border-collapse">
                    <thead>
                        <tr class="bg-gray-200 text-left text-gray-700">
                            {/* <th class="border-b p-3">Document ID</th> */}
                            <th class="border-b p-3">Document Name</th>
                            <th class="border-b p-3">Document Type</th>
                            <th class="border-b p-3">Upload Date</th>
                            <th class="border-b p-3">Status</th>
                            <th class="border-b p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uploadedDocuments.map((uploadedDocument) => {
                            return (
                                // ${ uploadedDocument.status==="completed" ? setIsActive(true) : setIsActive(false)};
                                <tr
                                    class="hover:bg-gray-100"
                                    key={uploadedDocument.document_id}
                                >
                                    {/* <td class="border-b p-3">{uploadedDocument.document_id}</td> */}
                                    <td class="border-b p-3">{uploadedDocument.document_name}</td>
                                    <td class="border-b p-3">{uploadedDocument.document_type}</td>
                                    <td class="border-b p-3">{uploadedDocument.upload_date}</td>
                                    <td
                                        class={`border-b p-3 ${uploadedDocument.status === "completed"
                                            ? "text-green-600"
                                            : uploadedDocument.status === "Uploaded"
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {/* {uploadedDocument.status.toUpperCase()} */}
                                        {uploadedDocument.status}
                                    </td>
                                    <td class="border-b p-3">



                                        {/* {uploadedDocument.status === "completed" ? (
                                            <Link
                                                key={case_id}
                                                to={`/admin/classfications/${client_id}/${case_id}/${uploadedDocument.document_id}`}
                                                target="_blank"
                                            >
                                                Annotation
                                            </Link>
                                        ) : (
                                            <span style={{ color: 'gray', cursor: 'not-allowed' }}>Annotation</span>
                                        )}

                                        {" "}| {" "} */}


                                        <button
                                            class="blue-500 hover:text-blue-700"
                                            type="button"
                                            onClick={() => handletToAssignDocTypeAndNaturOfDoc(uploadedDocument)}
                                        >
                                            Assign

                                        </button>
                                        {" | "}
                                        <button
                                            class="blue-500 hover:text-blue-700"
                                            type="button"
                                            onClick={() => handletToProcessDoc(uploadedDocument)}
                                        >
                                            Process

                                        </button>

                                        {/* {" | "}

                    <button
                      class="text-blue-500 blue-500 hover:text-blue-700"
                      type="button"
                      onClick={() => handleLODE(uploadedDocument.document_id)}
                    >
                      LODE

                    </button> */}

                                        {/* {" | "} */}

                                        {/* {uploadedDocument.status === "completed" ? (
                                            <Link key={case_id} to={"/admin/summary/" + client_id + "/" + case_id + "/" + uploadedDocument.document_id}
                                                target="_blank">Summary</Link>
                                        ) : (
                                            <span style={{ color: 'gray', cursor: 'not-allowed' }}>Summary</span>
                                        )}
                                        {" | "}
                                        <button
                                            class="text-red-500 hover:text-red-700"
                                            type="button"
                                            onClick={() => handleDelete(uploadedDocument.document_id)}
                                        >
                                            Delete

                                        </button> */}




                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>





            {isPopupOpen && (
                <div className="popup-overlay">
                    <SingleDocumentChat caseDetails={caseDetails} closePopup={closePopup} documentDetails={currentDocumentDetails} />
                    <button onClick={closePopup} className="popup-close-button">
                        Close
                    </button>
                </div>
            )}



        </card>
    );
};

export default RecentUploadedDocuments;
