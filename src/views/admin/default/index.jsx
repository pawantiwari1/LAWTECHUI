import React, { useState } from "react";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import { MdFileUpload} from "react-icons/md";
import Summary from "./components/Summary";
import Sidebar from "components/sidebar/index";
import CheckTable from "./components/CheckTable";
import ComplexTable from "./components/ComplexTable";


const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1); // Default to page 1
  return (
    <div>
      
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent icon={<MdFileUpload className="h-7 w-7" currentPage={currentPage} />}/>
        <WeeklyRevenue setCurrentPage={setCurrentPage} />
      </div>
      <div className="mt-5 grid ">
        <Summary/>
      </div>

    </div>
  );
};

export default Dashboard;
