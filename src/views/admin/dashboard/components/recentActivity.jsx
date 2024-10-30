import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "components/card";

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}recent-activity`
        );
        setActivities(response.data);
      } catch (error) {
        setError("Failed to fetch recent activities.");
        console.error(error);
      }
    };
    fetchActivities();
  }, []);

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Recent Activities
        </div>
      </header>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                  Description
                </div>
              </th>
              <th className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700">
                <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                  Timestamp
                </div>
              </th>
              {/* <th className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700">
                <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                  User
                </div>
              </th> */}
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <tr key={index}>
                <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                  {activity.description}
                </td>
                <td className="pb-[20px] pt-[14px] text-sm font-bold text-navy-700 dark:text-white sm:text-[14px]">
                  {new Date(activity.timestamp).toLocaleString()}
                </td>
                {/* <td className="pt-[14px] pb-[20px] sm:text-[14px] text-sm font-bold text-navy-700 dark:text-white">
                  {activity.user}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentActivities;
