import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "components/card";
import axios from "axios";
import { Chat } from "./Chat";
import FileUpload from "./FileUpload";
import ListOfEvents from "./ListOfEvents";
import UploadedDocuments from "./UploadedDocuments";
import RecentUploadedDocuments from "./RecentUploadedDocuments";
import "./chatpopup.css";
import Collapsible from 'react-collapsible';
import "@fortawesome/fontawesome-free/css/all.min.css"

const CaseProfile = () => {
  const { case_id } = useParams();
  const [caseDetails, setCaseDetails] = useState({});
  const [clientName, setClientName] = useState("");
  const [error, setError] = useState("");
  const [isChatCollapsed, setIsChatCollapsed] = useState(true);
  const [isEventCollapsed, setIsEventCollapsed] = useState(true);

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

  const toggleChatCollapse = () => {
    setIsChatCollapsed(!isChatCollapsed);
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
      </Card>
      <FileUpload caseDetails={caseDetails} />
      <RecentUploadedDocuments caseDetails={caseDetails} />
      <UploadedDocuments caseDetails={caseDetails} />
      {/* <Chat caseDetails={caseDetails} /> */}
     


      <Collapsible class="openorCloseChatCollapsable"
        trigger={
          <div className=" openorCloseChatCollapsable flex justify-between items-center items-center">
            <span>{isChatCollapsed ? "Open Chat" : "Close Chat"}</span>
            <i className={`fas ${isChatCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'} mr-2`}></i>
          </div>
        }
        onOpening={() => setIsChatCollapsed(false)}
        onClosing={() => setIsChatCollapsed(true)}
      >
        <Chat caseDetails={caseDetails} />
      </Collapsible>


      <Collapsible class="openorCloseChatCollapsable"
        trigger={
          <div className=" openorCloseChatCollapsable flex justify-between items-center items-center">
            <span>{isEventCollapsed ? "Open Events" : "Close Events"}</span>
            <i className={`fas ${isEventCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'} mr-2`}></i>
          </div>
        }
        onOpening={() => setIsEventCollapsed(false)}
        onClosing={() => setIsEventCollapsed(true)}
      >
        <ListOfEvents caseDetails={caseDetails} clientName={clientName} />
      </Collapsible>



    </div>
  );
};


export default CaseProfile;
