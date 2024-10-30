import React, { useState, useEffect } from "react";
import Widget1 from "components/widget1/Widget1";
import axios from "axios";
import Card from "components/card";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";
import RecentActivities from "./components/recentActivity";

const ViewDashboard = () => {
  const [caseCounts, setCaseCounts] = useState({
    ActiveCases: 0,
    LegalNotice: 0,
    LegalOpinion: 0,
    Miscellaneous: 0,
    Litigation: 0,
    ClosedCases: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegisteredCases = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}registered-cases`
        );
        const casesData = response.data;

        const countCases = {
          ActiveCases: 0,
          LegalNotice: 0,
          LegalOpinion: 0,
          Miscellaneous: 0,
          Litigation: 0,
          ClosedCases: 0,
        };

        casesData.forEach((caseItem) => {
          if (caseItem.status === "Active") {
            countCases.ActiveCases++;
            if (caseItem.casetype === "Legal Notice") {
              countCases.LegalNotice++;
            } else if (caseItem.casetype === "Legal Opinion") {
              countCases.LegalOpinion++;
            } else if (caseItem.casetype === "Misc/Other") {
              countCases.Miscellaneous++;
            } else if (caseItem.casetype === "Litigation/Arbitration") {
              countCases.Litigation++;
            }
          } else if (caseItem.status === "Closed") {
            countCases.ClosedCases++;
          }
        });

        setCaseCounts(countCases);
      } catch (error) {
        setError("Failed to fetch registered cases.");
        console.error(error);
      }
    };

    fetchRegisteredCases();
  }, []);
  return (
    <div>
      {/* Card widget */}

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget1
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Active Cases"}
          subtitle={caseCounts.ActiveCases.toString()}
        />
        <Widget1
          icon={<MdBarChart className="h-6 w-6" />}
          title={"Active Legal Notice"}
          subtitle={caseCounts.LegalNotice.toString()}
        />
        <Widget1
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Active Legal Opinion"}
          subtitle={caseCounts.LegalOpinion.toString()}
        />
        <Widget1
          icon={<MdBarChart className="h-6 w-6" />}
          title={"Active Litigatio/Arbitrary"}
          subtitle={caseCounts.Litigation.toString()}
        />
        <Widget1
          icon={<MdBarChart className="h-6 w-6" />}
          title={"Active Miscellaneous"}
          subtitle={caseCounts.Miscellaneous.toString()}
        />
        <Widget1
          icon={<MdBarChart className="h-6 w-6" />}
          title={"Total Closed Cases"}
          subtitle={caseCounts.ClosedCases.toString()}
        />
      </div>

      {/* Task chart & Calendar */}

      <div className="mt-8 grid grid-cols-1 gap-5 rounded-[20px]">
        <RecentActivities />
      </div>
    </div>
  );
};

export default ViewDashboard;
