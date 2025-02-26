import React, { useState, useEffect } from "react";
import Card from "components/card";
import axios from "axios";
import {
  MdChatBubbleOutline,
  MdDelete,
  MdEditNote,
  MdPreview,
} from "react-icons/md";

const LitigationView = () => {
  const [data, setData] = useState([]);
  const [clients, setClients] = useState({});

  useEffect(() => {
    const fetchRegisteredCases = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}registered-cases`
        );
        const litigationCases = response.data.filter(
          (caseItem) => caseItem.casetype === "Litigation/Arbitration"
        );
        setData(litigationCases);
        fetchClientNames(litigationCases);
      } catch (error) {
        console.error("Error fetching registered cases:", error);
      }
    };

    const fetchClientNames = async (cases) => {
      try {
        const clientIds = [
          ...new Set(cases.map((caseItem) => caseItem.client_id)),
        ];
        const clientNames = {};

        await Promise.all(
          clientIds.map(async (clientId) => {
            try {
              const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}client/${clientId}`
              );
              clientNames[clientId] = response.data.name;
            } catch (error) {
              console.error(
                `Error fetching client with ID ${clientId}:`,
                error
              );
            }
          })
        );

        setClients(clientNames);
      } catch (error) {
        console.error("Error fetching client names:", error);
      }
    };

    fetchRegisteredCases();
  }, []);

  const handleDelete = async (caseId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}registered-case/${caseId}`
      );
      setData(data.filter((caseItem) => caseItem._id !== caseId));
    } catch (error) {
      console.error("Error deleting case:", error);
    }
  };

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-1">
      <Card extra={"w-full pb-10 p-4 h-full"}>
        <header className="relative flex items-center justify-between">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Litigation/Arbitrary - View All
          </div>
        </header>

        <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    File No.
                  </div>
                </th>
                <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Case No.
                  </div>
                </th>

                <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Filling No.
                  </div>
                </th>
                <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Court/Tribunal
                  </div>
                </th>
                <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Title
                  </div>
                </th>
                <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Client
                  </div>
                </th>
                <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Status
                  </div>
                </th>

                <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                    {row.registration_number}
                  </td>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                    {row.case_number}
                  </td>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                    {row.filing_number}
                  </td>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                    {row.court_name}
                  </td>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                    {row.title}
                  </td>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                    {clients[row.client_id] || "Loading..."}
                  </td>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                    {row.status}
                  </td>

                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[18px]">
                    <button className="px-0.5 text-indigo-600 hover:text-indigo-900 dark:text-yellow-500 dark:hover:text-yellow-300">
                      <MdEditNote />
                    </button>
                    <button className="px-0.5 text-indigo-600 hover:text-indigo-900 dark:text-yellow-500 dark:hover:text-yellow-300">
                      <MdPreview />
                    </button>
                    <button
                      onClick={() => handleDelete(row.case_id)}
                      className="px-0.5 text-indigo-600 hover:text-indigo-900 dark:text-yellow-500 dark:hover:text-yellow-300"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default LitigationView;
