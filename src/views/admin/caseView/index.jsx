import React, { useState } from "react";
import LitigationView from "./components/LitigationView";
import LegalNoticeView from "./components/LegalNoticeView";
import LegalOpinionView from "./components/LegalOpinionView";
import MiscView from "./components/MiscView";



const CaseView = () => {
  
  return (
    <div>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-1">
        <LitigationView/>
        <LegalNoticeView/>
        <LegalOpinionView/>
        <MiscView/>
      </div>
    </div>
  );
};

export default CaseView;
