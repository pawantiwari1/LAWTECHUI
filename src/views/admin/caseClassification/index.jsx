import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "components/card";
import axios from "axios";
import CaseClassification from "./classify"
// import ClassEdit from "./class_edit";
import AppEdit from "./class_edit";
import WeeklyRevenue from "./classv_data";
import setAuthToken from 'views/auth/auth_service'

const ViewClassifications = () => {
  const { client_id, case_id , doc_id} = useParams();
  const [caseDetails, setCaseDetails] = useState({});
  const [clientName, setClientName] = useState("");
  const [error, setError] = useState("");
  
  const token = localStorage.getItem("token");
  if (token) {
    console.log("get token classify: ", token)
    // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.headers.common['Authorization'] =`Bearer' ${token}`;
    //  setAuthToken(token);
    console.log (`Bearer ${token}`)
  }else{
    console.log("get token: ", token)
  }

// kaladkad 
  // console.log("Kaladhar" , useParams())
  console.log("KP_" + client_id ,  case_id , doc_id)
  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}registered-case/${case_id}`
        );
        const caseData = response.data;
        setCaseDetails(caseData);

        // Fetch client details using client_id
        if (caseData.client_id) {
          const clientResponse = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}client/${caseData.client_id}`
          );
          setClientName(clientResponse.data.name);
        }
      } catch (error) {
        setError("Failed to fetch case or client details.");
        console.error(error);
      }
    };
    fetchCaseDetails();
  }, [case_id]);

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-1">
      {/* <Card extra={"w-full pb-10 p-4 h-full"}>
        <header className="relative flex items-center justify-between">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Case Details
          </div>
        </header>
        <div className="grid grid-cols-2 gap-4 p-4">
          {clientName && (
            <div>
              <div className="text-sm font-bold text-gray-600">
                Client Name:
              </div>
              <div className="text-sm font-bold text-navy-700 dark:text-white">
                {clientName}
              </div>
            </div>
          )}
          {Object.entries(caseDetails).map(
            ([key, value]) =>
              key !== "case_id" &&
              key !== "client_id" &&
              value && (
                <div key={key}>
                  <div className="text-sm font-bold capitalize text-gray-600">
                    {key.replace(/_/g, " ")}:
                  </div>
                  <div className="text-sm font-bold text-navy-700 dark:text-white">
                    {value}
                  </div>
                </div>
              )
          )}
        </div>
      </Card> */}

      {/* <caseClassification caseDetails={caseDetails} /> */}
      {/* <CaseClassification caseDetails={caseDetails} docsDetail={doc_id} /> */}
      {/* <ClassEdit caseDetails={caseDetails} /> */}
      {/* <AppEdit caseDetails={caseDetails} /> */}
      <WeeklyRevenue caseDetails={caseDetails}  docsDetail={doc_id} />
      {/* <UploadedDocuments caseDetails={caseDetails} /> */}
      {/* <Chat caseDetails={caseDetails} /> */}
      {/* <ListOfEvents caseDetails={caseDetails} clientName={clientName} /> */}
    </div>
  );
};

export default ViewClassifications;
