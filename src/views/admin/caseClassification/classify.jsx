import axios from "axios";
import Card from "components/card";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import setAuthToken from 'views/auth/auth_service'


const CaseClassification = ({caseDetails , docsDetail}) => {
    const { case_id, client_id} = caseDetails;
    const { doc_id} = docsDetail

    const [page_pdf, setPage] = useState(1); // Default page number
    const [refreshKey, setRefreshKey] = useState(0); 

    const goToPage = (pageNumber) => {
      setPage(pageNumber);
      setRefreshKey(refreshKey + 1); // Change key to force iframe refresh
    };

    // console.log("classify_" + caseDetails.client_id + "/" + caseDetails.case_id + "/" + doc_id)
     
  const token = localStorage.getItem("token");
  if (token) {
    console.log("get token L : ", token)
     setAuthToken(token);
  }else{
    console.log("get token 12: ", token)
  }


    const dt =  new Date().getTime()
    // const doc_id= 'None'
    const file_link  =   `${process.env.REACT_APP_API_BASE_URL}file_preview/` + "?file_path=1.pdf.pdf&case_id=" + caseDetails.case_id + "&client_id="+caseDetails.client_id + "&doc_id=" + docsDetail + "&dt"+dt
    // const file_link = ""
    // console.log("LL",file_link, docsDetail)
    
    return (
        <Card extra={"w-full pb-10 p-4 h-full"}>
            <h1 class="text-2xl font-semibold text-gray-800">File Preview</h1>
            <div className="h-full w-full mt-4 flex flex-col items-center">
            <iframe
            id = "file_preview" 
            key={refreshKey}
            //   src={uploadedPdf.url}
              // src = {file_link}
              src={`${file_link}#page=${page_pdf}&random=${refreshKey}`} 
              width="100%"
              height="500px"
              title="PDF Preview"
              frameborder='0'
            ></iframe>
          </div>

        </Card>
)
};

export default CaseClassification;