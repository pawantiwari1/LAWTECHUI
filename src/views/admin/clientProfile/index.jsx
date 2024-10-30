import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Card from "components/card";
import axios from "axios";
import { MdPreview } from "react-icons/md";
import Switch from "components/switch";

const ClientProfile = () => {
  const { client_id } = useParams();
  const [client, setClient] = useState({});
  const [cases, setCases] = useState([]);
  const [error, setError] = useState("");
  const history = useNavigate();

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const clientResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}client/${client_id}`
        );
        setClient(clientResponse.data);

        const casesResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}registered-cases`
        );
        const clientCases = casesResponse.data.filter(
          (caseItem) => caseItem.client_id === client_id
        );
        setCases(clientCases);
      } catch (error) {
        setError("Failed to fetch client details or cases.");
        console.error(error);
      }
    };
    fetchClientDetails();
  }, [client_id]);

  const handleStatusChange = async (case_id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Closed" : "Active";
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}registered-case/${case_id}`,
        {
          status: newStatus,
        }
      );
      setCases(
        cases.map((caseItem) =>
          caseItem.case_id === case_id
            ? { ...caseItem, status: newStatus }
            : caseItem
        )
      );
    } catch (error) {
      setError("Failed to update case status.");
      console.error(error);
    }
  };

  const handleView = (case_id) => {
    history(`/admin/case-profile/${case_id}`);
  };

  return (
    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-1">
      <Card extra={"w-full pb-10 p-4 h-full"}>
        <header className="relative flex items-center justify-between">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Client Details
          </div>
        </header>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <div className="text-sm font-bold text-gray-600">Name:</div>
            <div className="text-sm font-bold text-navy-700 dark:text-white">
              {client.name}
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-600">Phone:</div>
            <div className="text-sm font-bold text-navy-700 dark:text-white">
              {client.phone}
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-600">Address:</div>
            <div className="text-sm font-bold text-navy-700 dark:text-white">
              {client.address}
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-600">Email:</div>
            <div className="text-sm font-bold text-navy-700 dark:text-white">
              {client.email}
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-600">Whatsapp:</div>
            <div className="text-sm font-bold text-navy-700 dark:text-white">
              {client.whatsapp}
            </div>
          </div>
        </div>
      </Card>
      <Card extra={"w-full pb-10 p-4 h-full"}>
        <header className="relative flex items-center justify-between">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Client Cases
          </div>
        </header>

        <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                  <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                    Case Name
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
              {cases.map((caseItem) => (
                <tr key={caseItem.case_id}>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                    {caseItem.title}
                  </td>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                    <Switch
                      color={caseItem.status === "Active" ? "green" : "red"}
                      checked={caseItem.status === "Active"}
                      onChange={() =>
                        handleStatusChange(caseItem.case_id, caseItem.status)
                      }
                    />
                  </td>
                  <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[18px]">
                    {/* <Link to={`/case-profile/${caseItem.case_id}`} className="px-2 text-indigo-600 hover:text-indigo-900 dark:text-yellow-500 dark:hover:text-yellow-300">
                      <MdPreview />
                    </Link> */}
                    <button
                      onClick={() => handleView(caseItem.case_id)}
                      className="px-2 text-indigo-600 hover:text-indigo-900 dark:text-yellow-500 dark:hover:text-yellow-300"
                    >
                      <MdPreview />
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

export default ClientProfile;
