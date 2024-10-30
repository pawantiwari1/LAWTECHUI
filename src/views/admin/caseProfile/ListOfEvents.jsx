import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Select from 'react-select';


const ListOfEvents = ({ caseDetails, clientName }) => {
  const { case_id, client_id, registration_number } = caseDetails;
  const [events, setEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]); // State to store options
  const [filteredEvents, setFilteredEvents] = useState([]); // State to store filtered events

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    // Filter events based on selected filenames
    const selectedFilenames = selectedOptions.map(option => option.value);
    const filtered = events.filter(event => selectedFilenames.includes(event.file_name));
    setFilteredEvents(filtered);
    console.log("filtered on change", filtered);

  };

  useEffect(() => {
    const getListOfEvents = async () => {
      try {
        const res = await axios.get(
          // `${process.env.REACT_APP_API_BASE_URL}chat/list_of_events`,
          `${process.env.REACT_APP_API_BASE_URL}get_lode/`,
          {
            params: {
              case_number: case_id,
              client_id,
              client_name: clientName,
              registration_number,
            },
          }
        );
        const data = res.data.list_of_events || [];
        // toast.message(data)
        if (res.data.status === "Created") {
          toast.success("Lode generated. Please refresh page");
        }
        setEvents(data); //set event state

        // Use a Set to track unique filenames
        const uniqueFilenames = new Set();
        const eventOptions = data.reduce((acc, event, index) => {
          const filename = event.file_name || `event${index + 1}`;
          if (!uniqueFilenames.has(filename)) {
            uniqueFilenames.add(filename);
            acc.push({ value: filename, label: filename });
          }
          return acc;
        }, []);
        setOptions(eventOptions); // Set options state
        setSelectedOptions(eventOptions); // Select all options by default


        const pending_events = res.data.pending_files

        const listItems = pending_events.map(pe => <i>{pe}  </i>);

        setPendingEvents(listItems)
      } catch (error) {
        console.log(error)
        // toast.error("Unable to fetch events");

      }
    };
    getListOfEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseDetails, clientName]);

  useEffect(() => {
    // Ensure filteredEvents is updated when selectedOptions changes
    const selectedFilenames = selectedOptions.map(option => option.value);
    const filtered = events.filter(event => selectedFilenames.includes(event.file_name));
    setFilteredEvents(filtered);
  }, [selectedOptions, events]);



  const columns = [
    { name: "Sr. NO" },
    {
      name: "File",
    }, { name: "Pages" }, { name: "Event Name" }, { name: "Date" }, { name: "Description" }
  ]

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid black; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1>List of Documents and Events</h1>');
    printWindow.document.write('<table>');

    // Add table header
    printWindow.document.write('<tr>');
    columns.forEach(column => {
      if (column.name !== "Actions") {
        printWindow.document.write(`<th>${column.name}</th>`);
      }
    });
    printWindow.document.write('</tr>');

    // Add table data
    events.forEach((row, index) => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${index + 1}</td>`);
      printWindow.document.write(`<td>${row.file_name}</td>`);
      printWindow.document.write(`<td>${row.pages}</td>`);
      printWindow.document.write(`<td>${row["Event Name"]}</td>`);
      printWindow.document.write(`<td>${row.Date}</td>`);
      printWindow.document.write(`<td>${row.description}</td>`);
      printWindow.document.write('</tr>');
    });

    printWindow.document.write('</table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <card extra={"w-full pb-10 p-4 h-full"}>
      {/* <!-- Title --> */}
      <div class="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h1 class="text-2xl font-semibold text-gray-800">
          Annexure: List of Events
        </h1>
        {/* <h2>
        <Link  key={case_id} to={`${process.env.REACT_APP_API_BASE_URL}download_csv/?client_id=`+ client_id + "&case_id="+case_id} target="_blank">Download Data</Link>
        </h2>
        <p class="text-gray-600">Legal Documentation - Case Reference XYZ123</p> */}

        {/* <!-- Download Button --> */}
        <br />

        <div className="flex multiselectAlignmnet  w-full space-between ">
          <div className="multiselectWidth">
            <Select
              isMulti
              name="events"
              options={options}
              className="basic-multi-select"
              classNamePrefix="select"
              value={selectedOptions}
              onChange={handleChange}
              placeholder="Select events..."
            />
          </div>
          <div>
            <button
              id="download-pdf"
              class="absolute right-0 top-0 mr-4 mt-4 flex items-center rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 focus:outline-none"
            >
              <i class="fas fa-download mr-2"></i> Download PDF
            </button>

            <button
              onClick={handlePrint}
              style={{
                backgroundColor: "#ffc107",
                color: "#000",
                padding: "10px 20px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Print
            </button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button
              style={{
                backgroundColor: "#ffc107",
                color: "#000",
                padding: "10px 20px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Link key={case_id} to={`${process.env.REACT_APP_API_BASE_URL}download_csv/?client_id=` + client_id + "&case_id=" + case_id} target="_blank">Download Data</Link>
            </button>
          </div>




        </div>


        <br></br>
        <p>Pending files: {pendingEvents}</p>

        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-200 text-left text-gray-700">
              {/* <th class="border-b p-3">Event ID</th> */}
              <th class="border-b p-3">File</th>
              <th class="border-b p-3">Pages</th>
              <th class="border-b p-3">Event Name</th>
              <th class="border-b p-3">Date</th>
              <th class="border-b p-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event, index) => {
              return (
                // key={event.event_id}
                <tr class="hover:bg-gray-100" key={index}>
                  {/* <td class="border-b p-3">{event.event_id}</td> */}
                  <td class="border-b p-3">{event.file_name}</td>
                  <td class="border-b p-3">
                    {/* {event.pages} */}
                    <Link className="font-medium text-blue-600 dark:text-blue-500  hover:underline" key={caseDetails.case_id} to={`${process.env.REACT_APP_API_BASE_URL}lode_file_preview/` + "?file_path=1.pdf.pdf&case_id=" + caseDetails.case_id + "&client_id=" + caseDetails.client_id + "&doc_name=" + event.file_name + "#page=" + event.pages.split('-')[0]} target="_blank"> {event.pages}</Link>
                  </td>
                  <td class="border-b p-3">{event["Event Name"]}</td>
                  <td class="border-b p-3">{event.Date}</td>
                  <td class="border-b p-3">{event.description}</td>
                  {/* <td
                    class={`border-b p-3 ${
                      event.status === "complete"
                        ? "text-green-600"
                        : event.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {event.status}
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </card>
  );
};

export default ListOfEvents;
