import React, { useEffect, useState, useRef } from "react";
import Card from "components/card";
import setAuthToken from 'views/auth/auth_service'
import axios from "axios";
import DataTable from "react-data-table-component";
// import sampleData from "./Data/sampleclassrelu.js";
import { toast } from "react-toastify";

// Helper function to group pages by category
const groupByCategory = (data) => {
  const groupedData = data.reduce((acc, item) => {
    const category = item.category.toLowerCase(); // Normalize category for case-insensitive grouping
    if (!acc[category]) {
      acc[category] = { category: item.category, pages: [parseInt(item.page)] };
    } else {
      acc[category].pages.push(parseInt(item.page)); // Add page number to the existing category
    }
    return acc;
  }, {});

  return Object.values(groupedData).map(group => ({
    ...group,
    pages: group.pages.sort((a, b) => a - b), // Sort pages numerically
  }));
};

const DataTableComponent = ({caseDetails , docsDetail}) => {
  // const [data, setData] = useState(groupByCategory(sampleData)); // Grouped data initially
  const [data, setData] = useState(); // Grouped data initially
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [newPage, setNewPage] = useState("");
  const [newCategory, setNewCategory] = useState("");
  // console.log("case :", caseDetails)
  // console.log("docid",docsDetail)
  // Regroup data whenever sampleData changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Perform the fetch request
        console.log("case under ue :", caseDetails)
        console.log("docid under ue",docsDetail)
        const { client_id, case_id} = caseDetails
        // const {doc_id} = docsDetail

        const params = {case_id, client_id, docsDetail};
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}cls_result/`, {
          method: "POST", // Use POST if needed
          headers: {
            "Content-Type": "application/json", // Ensure the server can parse the body
          },
          body: JSON.stringify(params) // Send an empty object as the body if needed
        });

        // Check if the response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response JSON
        const result = await response.json();

        // Process and set the data
        const groupedData = groupByCategory(result); // Assuming groupByCategory is your transformation function
        setData(groupedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // setError(error); // Store the error for displaying in the UI if needed
        toast.error(error)
      }
    };

    fetchData(); // Call the fetch function

  }, [caseDetails, docsDetail]); // Empty dependency array ensures this runs once when the component mounts
 

  const handleEdit = (item) => {
    setCurrentItem(item);
    setEditValue(item.pages.join(", ")); // Set page numbers as a comma-separated string
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    const updatedPages = editValue.split(",").map((p) => parseInt(p.trim())); // Convert edited value back to array
    const updatedData = data.map((item) => {
      if (item.category === currentItem.category) {
        return { ...item, pages: updatedPages }; // Update the page numbers for the category
      }
      return item;
    });
    setData(updatedData);
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    if (!newPage || !newCategory) {
      alert("Please enter both page number and category.");
      return;
    }

    const newPageNumber = parseInt(newPage.trim(), 10);
    const normalizedCategory = newCategory.trim().toLowerCase();

    // Check if the category already exists
    const existingCategory = data.find((item) => item.category.toLowerCase() === normalizedCategory);

    if (existingCategory) {
      // If the category exists, add the page number to the existing category
      const updatedData = data.map((item) => {
        if (item.category.toLowerCase() === normalizedCategory) {
          return { ...item, pages: [...item.pages, newPageNumber].sort((a, b) => a - b) };
        }
        return item;
      });
      setData(updatedData);
    } else {
      // If the category doesn't exist, create a new entry
      const newRow = {
        category: newCategory.trim(),
        pages: [newPageNumber],
        editedCategory: "", // Initialize edited category field
      };
      setData([...data, newRow]);
    }

    // Clear form fields and close the modal
    setNewPage("");
    setNewCategory("");
    setIsAddModalOpen(false);
  };

  const handleSave = () => {
    console.log("Table Data:", data);
    console.log(caseDetails, docsDetail)
    const { client_id, case_id} = caseDetails
    // let docID = caseDetails
    console.log("KP:",client_id, case_id, docsDetail)
    const response = axios.post(`${process.env.REACT_APP_API_BASE_URL}save-classifications/`,
      {client_id, case_id, docsDetail,data},
       {params : {client_id, case_id, docsDetail}},
    );
    console.log(response)
    // const params = {client_id, case_id, docsDetail}
    // const response =  fetch(`${process.env.REACT_APP_API_BASE_URL}save-classifications/`, {
    //   method: "POST", // Use POST if needed
    //   headers: {
    //     "Content-Type": "application/json", // Ensure the server can parse the body
    //   },
    //   body: JSON.stringify(params) // Send an empty object as the body if needed
    // });

    // // Check if the response is OK
    // if (!response.ok) {
    //   throw new Error(`HTTP error! Status: ${response.status}`);
    // }
    // // Parse the response JSON
    // const result =  response.json();
    // console.log(result)
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      width: "200px",
    },
    {
      name: "Page Number",
      selector: (row) => row.pages.join(", "), // Join page numbers with commas
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleEdit(row)}
          style={{
            backgroundColor: "#007BFF",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
      ),
      width: "150px",
    },
  ];

  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
      <div className="md:mt-16 lg:mt-0">
    
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        backgroundColor: "#E0F7FA",
        padding: "10px",
        borderRadius: "8px",
      }}
    >
      <h1 style={{ marginBottom: "8px" }}>Document Classification</h1>

      <DataTable
        columns={columns}
        data={data}
        pagination
        customStyles={{
          header: {
            style: {
              backgroundColor: "#007BFF",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "bold",
            },
          },
          rows: {
            style: {
              minHeight: "56px", // override the row height
            },
          },
          headCells: {
            style: {
              backgroundColor: "#007BFF",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
            },
          },
          cells: {
            style: {
              fontSize: "17px",
            },
          },
        }}
      />

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          + Add New Row
        </button>
        <button
          onClick={handleSave}
          style={{
            backgroundColor: "#17a2b8",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Save
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
              width: "400px",
            }}
          >
            <h2
              style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}
            >
              Edit Page Numbers
            </h2>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{
                width: "95%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleUpdate}
                style={{
                  backgroundColor: "#28a745",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Update
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Row Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
              width: "400px",
            }}
          >
            <h2
              style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}
            >
              Add New Row
            </h2>
            <input
              type="text"
              value={newPage}
              onChange={(e) => setNewPage(e.target.value)}
              placeholder="Page Number"
              style={{
                width: "95%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category"
              style={{
                width: "95%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleAdd}
                style={{
                  backgroundColor: "#28a745",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Add
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div></Card>);
};

export default DataTableComponent;
