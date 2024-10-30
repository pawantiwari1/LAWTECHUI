import React, { useState, useEffect } from "react";
import Card from "components/card";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete, MdEditNote, MdPreview } from "react-icons/md";

const ViewClient = () => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const history = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}clients`
        );
        const registeredCasesResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}registered-cases`
        );

        const clientsData = clientsResponse.data;
        const registeredCasesData = registeredCasesResponse.data;

        // Map client IDs to their respective case counts
        const clientCaseCounts = {};
        registeredCasesData.forEach((caseItem) => {
          const clientId = caseItem.client_id;
          if (clientId in clientCaseCounts) {
            clientCaseCounts[clientId]++;
          } else {
            clientCaseCounts[clientId] = 1;
          }
        });

        // Combine client data with case counts
        const clientsWithCases = clientsData.map((client) => ({
          ...client,
          cases: clientCaseCounts[client.client_id] || 0,
        }));

        setClients(clientsWithCases);
      } catch (error) {
        setError("Failed to fetch clients or registered cases.");
        console.error(error);
      }
    };
    fetchClients();
  }, []);

  const handleDelete = async (clientId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}client/${clientId}`
      );
      setClients(clients.filter((client) => client.client_id !== clientId));
    } catch (error) {
      setError("Failed to delete client.");
      console.error(error);
    }
  };

  const handleView = (clientId) => {
    history(`/admin/client-book/view-client/client-details/${clientId}`);
  };

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-1">
      <Card extra={"w-full pb-10 p-4 h-full"}>
        <header className="relative flex items-center justify-between">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Client Lists
          </div>
        </header>

        <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Serial Number
                  </div>
                </th>
                <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Client Name
                  </div>
                </th>
                <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    No. of Cases
                  </div>
                </th>
                <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Contact Details
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
              {clients.map((client, index) => (
                <tr key={client.client_id}>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                    {index + 1}
                  </td>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                    {client.name}
                  </td>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                    {client.cases}
                  </td>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                    {client.phone}
                  </td>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[18px]">
                    <button className="px-2 text-indigo-600 hover:text-indigo-900 dark:text-yellow-500 dark:hover:text-yellow-300">
                      <MdEditNote />
                    </button>
                    <button
                      onClick={() => handleView(client.client_id)}
                      className="px-2 text-indigo-600 hover:text-indigo-900 dark:text-yellow-500 dark:hover:text-yellow-300"
                    >
                      <MdPreview />
                    </button>
                    <button
                      onClick={() => handleDelete(client.client_id)}
                      className="px-2 text-red-600"
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

export default ViewClient;
