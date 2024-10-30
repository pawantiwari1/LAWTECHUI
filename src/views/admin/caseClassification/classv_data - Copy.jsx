import React, { useEffect, useState, useRef } from "react";
import Card from "components/card";
import setAuthToken from 'views/auth/auth_service'
import axios from "axios";

const WeeklyRevenue = ({caseDetails,  docsDetail}) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null); // Reference for the table content
  // const { case_id, client_id} = caseDetails()
  const { case_id, client_id} = caseDetails;
  const { cls_doc_id } = docsDetail;

  console.log("Kaladhar case details ", case_id, client_id, docsDetail)

  const token = localStorage.getItem("token");
  if (token) {
    // console.log("get token classify: ", token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    //  setAuthToken(token);
    // console.log (`Bearer ${token}`)
  }else{
    console.log("get token classify: ", token)
  }

  useEffect(() => {
    // Fetch data from the backend initially
    // console.log("fetch" ,caseDetails.case_id, caseDetails.client_id, docsDetail);

    // Fetch data from the backend every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async (case_id, client_id, cls_doc_id) => {
    try {
      console.log("NEW" , caseDetails)

      // const url = new URL("http://localhost:8000/get-classification-results/");
      // url.searchParams.append('case_id', case_id);
      // url.searchParams.append('client_id', client_id);
      // const case_id1 = caseDetails.case_id
      // const client_id1 = caseDetails.client_id
      // // const docid = docsDetail

      // const params = {case_id1, client_id1, docsDetail};
      // console.log("params", params)
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cls_result/`)
      //   {
      //     method: "POST", // Use POST if you are sending data in the body
      //     headers: {
      //       "Content-Type": "application/json", // Ensure the server can parse the body
      //     },
      //     body: JSON.stringify(params), // Send case_id and client_id in the body
      //   }
      // );


      const clonedResponse = await response.clone(); // Clone the response
      const data = await clonedResponse.json(); // Read JSON content from the cloned response
      if (Object.keys(data).length === 0) {
        // No classification results available
        setLoading(false);
      } else {
        // Transform the data
        const transformedData = transformData(data);
        setTableData(transformedData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
      setLoading(false);
    }
  };

  const getPagesForBucket = (bucket) => {
    // Find the table row data object for the clicked bucket
    const rowData = tableData.find((row) => row.bucket === bucket);

    // If the row data is found, return the original file name (which represents the pages)
    if (rowData) {
      return rowData.originalFileName;
    }

    // If no row data is found, return an empty string
    return "";
  };

  // Function to transform data
  const transformData = (data) => {
    const buckets = {};
    Object.keys(data).forEach((key) => {
      const pageNum = parseInt(key, 10);
      const bucket = data[key];
      if (!buckets[bucket]) {
        buckets[bucket] = [];
      }
      buckets[bucket].push(pageNum);
    });

    const ranges = (nums) => {
      nums.sort((a, b) => a - b);
      let ranges = [];
      let start, end;
      for (let i = 0; i < nums.length; i++) {
        start = nums[i];
        while (nums[i + 1] - nums[i] === 1) {
          i++;
        }
        end = nums[i];
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
      }
      return ranges.join(", ");
    };

    return Object.keys(buckets).map((bucket, index) => ({
      serialNo: index + 1,
      originalFileName: buckets[bucket].length > 0 ? ranges(buckets[bucket]) : "-",
      bucket,
    }));
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${tableRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return <p>Waiting for file to upload and execute...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (tableData.length === 0) {
    return <p>No classification results available.</p>;
  }

  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
      <div className="md:mt-16 lg:mt-0">
        <div ref={tableRef} className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-navy-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  S No.
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Page Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bucket
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  New Bucket
                </th>

                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-navy-900">
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-500 dark:text-gray-300">
                    {row.serialNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-left text-gray-900 dark:text-white">
                    {row.originalFileName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-500 dark:text-gray-300">
                    {row.bucket}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-gray-500 dark:text-gray-300">
                    <input name={row.bucket} value={row.bucket} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-yellow-500 dark:hover:text-yellow-300" onClick={() => console.log(getPagesForBucket(row.bucket))}>
                      Chat with {row.bucket}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={handlePrint}
          className="border border-green-500 rounded-md px-4 py-2 mt-4 transition-colors duration-300 ease-in-out hover:bg-green-500 hover:text-white"
        >
          Print Annotation Table
        </button>
      </div>
    </Card>
  );
};

export default WeeklyRevenue;