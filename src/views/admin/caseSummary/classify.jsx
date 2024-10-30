import axios from "axios";
import Card from "components/card";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import setAuthToken from 'views/auth/auth_service'

const processSummary = (rawSummary) => {
  const summaryParts = rawSummary.split(/[\n\r]+|:\s+/);
  const formattedSummary = [];

  summaryParts.forEach((part) => {
    part = part.trim();
    if (part.includes(":")) {
      const [label, content] = part.split(":");
      formattedSummary.push({ label: label.trim(), content: content.trim() });
    } else {
      if (/^\d+\.\s+/.test(part)) {
        formattedSummary.push({ content: `<b>${part}</b>` });
      } else {
        const lastItem = formattedSummary[formattedSummary.length - 1];
        if (lastItem && lastItem.label) {
          lastItem.content += `\n  * ${part}`;
        } else {
          formattedSummary.push({ content: part });
        }
      }
    }
  });

  return formattedSummary;
};

const CaseDoc = ({caseDetails , docsDetail}) => {
    const { case_id, client_id} = caseDetails;
    const { doc_id} = docsDetail
    // const [summuary, setSummuary] = useState([])

    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    // const summaryRef = useRef(null); // Reference for the summary content

    console.log("summary" + caseDetails.client_id + "/" + caseDetails.case_id + "/" + docsDetail)
     
    const token = localStorage.getItem("token");
    if (token) {
      console.log("get token L : ", token)
      setAuthToken(token);
    }else{
      // console.log("get token 12: ", token)
    }

    // const dt =  new Date().getTime()
    
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Perform the fetch request
          const { client_id, case_id} = caseDetails
          // const {doc_id} = docsDetail
          const params = {case_id, client_id, docsDetail};
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}summarize-case-documents/`, {
            method: "POST", // Use POST if needed
            headers: {
              "Content-Type": "application/json", // Ensure the server can parse the body
            },
            body: JSON.stringify(params) // Send an empty object as the body if needed
          });
  
          // Check if the response is OK
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          // Parse the response JSON
          const result = await response.json();
          setLoading(false)
          const summaryResult = processSummary(result)
          setSummary(summaryResult)
          // Process and set the data
        } catch (error) {
          console.error("Error fetching data:", error);
          // setError(error); // Store the error for displaying in the UI if needed
          toast.error(error)
          setLoading(false)
        }
       
      };
  
      fetchData(); // Call the fetch function
  
    }, [caseDetails, docsDetail]); 

    return (
      <Card extra="!p-[20px] text-center">
        <div className="flex flex-col items-left">
          <div>
          {loading && <p>Loading Summary, please wait...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {summary && (
              <>
                <ul style={{ textAlign: "left" }}>
                  {summary.map((item, index) => (
                    <li key={index}>
                      {item.label && <b>{item.label}:</b>}
                      <span dangerouslySetInnerHTML={{ __html: item.content }} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </Card>
    );
};

export default CaseDoc;