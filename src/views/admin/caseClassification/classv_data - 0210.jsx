import React, { useEffect, useState, useRef } from "react";
import Card from "components/card";
import setAuthToken from 'views/auth/auth_service'
import axios from "axios";
import DataTable from "react-data-table-component";
// import sampleData from "./Data/sampleclassrelu.js";
import { toast } from "react-toastify";

const categories = [
  "Custom",
  "FIR",
  "Statement",
  "Forensic Report",
  "Medical Report",
  "Case Diary",
  "Scene of Crime",
  "Technical Evidence",
  "Charge Sheet (Charges pressed against accused)",
  "Inner Case Diary",
  "List of Witness and Evidences",
  "Notice",
  "Emails",
  "RI Slip",
  "Letter",
  "Debit Note",
  "Judgement",
  "Complaint",
  "Evidence",
  "Chargesheet",
  "Record",
  "Petition",
  "Others"
];

const pageNumbersToRanges = (pages) => {
  if (pages.length === 0) return "No Pages";
  
  const sortedPages = [...new Set(pages)].sort((a, b) => a - b);
  let ranges = [];
  let rangeStart = sortedPages[0];
  let rangeEnd = sortedPages[0];

  for (let i = 1; i <= sortedPages.length; i++) {
    if (i < sortedPages.length && sortedPages[i] === rangeEnd + 1) {
      rangeEnd = sortedPages[i];
    } else {
      if (rangeStart === rangeEnd) {
        ranges.push(rangeStart.toString());
      } else if (rangeEnd === rangeStart + 1) {
        ranges.push(rangeStart.toString(), rangeEnd.toString());
      } else {
        ranges.push(`${rangeStart}-${rangeEnd}`);
      }
      rangeStart = rangeEnd = sortedPages[i];
    }
  }

  return ranges.join(', ');
};

const groupByCategory = (data) => {
  const groupedData = data.reduce((acc, item) => {
    const category = item.category.toLowerCase();
    if (!acc[category]) {
      acc[category] = {
        category: item.category,
        pages: [],
        Annotated_by: [],
        editedPages: []
      };
    }
    acc[category].pages.push(...(Array.isArray(item.pages) ? item.pages : [item.pages]));
    acc[category].Annotated_by.push(item.Annotated_by);
    acc[category].editedPages.push(...(Array.isArray(item.editedPages) ? item.editedPages : []));
    return acc;
  }, {});

  return Object.values(groupedData).map(group => ({
    ...group,
    Annotated_by: [...new Set(group.Annotated_by)].join(", "),
    pages: pageNumbersToRanges([...new Set(group.pages)].map(Number)),
    editedPages: pageNumbersToRanges([...new Set(group.editedPages)].map(Number))
  }));
};

const DataTableComponent = ({caseDetails , docsDetail}) => {
  const [data, setData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [newPage, setNewPage] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customCategory2, setCustomCategory2] = useState(false);
  const [customCategory3, setCustomCategory3] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

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
 
  const handleDelete = (rowToDelete) => {
    const updatedData = data.filter(row => row !== rowToDelete);
    setData(updatedData);
  };

  const handlePageClick = (pageNumber) => {
    if (!isNaN(pageNumber) && pageNumber !== "") {
      setPopupMessage(`Fetching page number ${pageNumber}`);
      setTimeout(() => setPopupMessage(""), 2000); // Hide popup after 2 seconds
    }
  };


  const renderPageNumbers = (pages) => {
    if (!Array.isArray(pages)) {
      pages = pages.split(',').flatMap(range => {
        const [start, end] = range.split('-').map(Number);
        return end ? Array.from({length: end - start + 1}, (_, i) => start + i) : [start];
      });
    }
    return pages.map(page => {
      if (!isNaN(page) && page !== "") {
        return (
          <span 
            key={page} 
            onClick={() => handlePageClick(page)}
            style={{
              cursor: 'pointer',
              color: 'blue',
              textDecoration: 'underline',
              marginRight: '5px'
            }}
          >
            {page}
          </span>
        );
      }
      return null; // Don't render anything for NaN or empty strings
    }).filter(Boolean); // Remove null entries
  };

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
    printWindow.document.write('<h1>Document Sample Editing Table</h1>');
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
    data.forEach((row, index) => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${index + 1}</td>`);
      printWindow.document.write(`<td>${Array.isArray(row.Annotated_by) ? row.Annotated_by.join(", ") : row.Annotated_by || "N/A"}</td>`);
      printWindow.document.write(`<td>${row.pages}</td>`);
      printWindow.document.write(`<td>${row.editedPages}</td>`);
      printWindow.document.write(`<td>${row.category}</td>`);
      printWindow.document.write('</tr>');
    });
    
    printWindow.document.write('</table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setEditValue(item.pages);
    setEditCategory(item.category);
  
    if (!categories.map(category => category.toLowerCase()).includes(item.category.toLowerCase())) {
      setCustomCategory3(true);
    } else {
      setCustomCategory3(false);
    }
  
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    const updatedPages = editValue.split(',').flatMap(range => {
      const [start, end] = range.split('-').map(Number);
      return end ? Array.from({length: end - start + 1}, (_, i) => start + i) : [start];
    });
    
    const updatedData = data.map((item) => {
      if (item.category === currentItem.category) {
        return {
          ...item,
          pages: item.pages, // Keep the original pages
          editedPages: updatedPages, // Store as an array
          category: editCategory
        };
      }
      return item;
    });
    
    setData(updatedData);
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    if (newPage) {
      const pagesArray = newPage.split(',').flatMap(range => {
        const [start, end] = range.split('-').map(Number);
        return end ? Array.from({length: end - start + 1}, (_, i) => start + i) : [start];
      });

      const category = editCategory || customCategory;
      if (!category) {
        alert("Please select or enter a category.");
        return;
      }

      const newRow = {
        category: category,
        pages: pagesArray, // Store as an array
        Annotated_by: "AI", // Default value
        editedPages: [] // Empty array for new entries
      };

      setData([...data, newRow]);
      setIsAddModalOpen(false);
      setNewPage("");
      setEditCategory("");
      setCustomCategory("");
    } else {
      alert("Please enter at least one page number.");
    }
  };

  const handleSave = () => {
    const formattedData = data.map(item => ({
      ...item,
      pages: Array.isArray(item.pages) ? item.pages : [Number(item.pages)],
      editedPages: Array.isArray(item.editedPages) ? item.editedPages : 
        (item.editedPages === "No Edits" ? [] : [Number(item.editedPages)])
    }));
    const { client_id, case_id} = caseDetails
    // let docID = caseDetails
    // console.log("KP:",client_id, case_id, docsDetail)
    const response = axios.post(`${process.env.REACT_APP_API_BASE_URL}save-classifications/`,
      {client_id, case_id, docsDetail,data:formattedData},
       {params : {client_id, case_id, docsDetail}},
    );
    console.log(response)
    toast.success("Classifications saved.")
    console.log("Table Data:", formattedData);
  };

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      width: "200px",
    },
    {
      name: "Annotated By",
      selector: (row) => row.Annotated_by || "N/A",
      sortable: true,
    },
    {
      name: "Page Number",
      cell: (row) => renderPageNumbers(row.pages),
      sortable: true,
    },
    {
      name: "Edited Page Numbers",
      cell: (row) => row.editedPages && row.editedPages.length > 0 ? 
        renderPageNumbers(row.editedPages) : "No Edits",
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            onClick={() => handleEdit(row)}
            style={{
              backgroundColor: "#007BFF",
              color: "#fff",
              padding: "5px 10px",
              marginRight: "10px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row)}
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        backgroundColor: "#E0F7FA",
        padding: "10px",
        borderRadius: "8px",
        position: "relative",
      }}
    >
      <h1 style={{ marginBottom: "8px" }}>Document Sample Editing Table</h1>

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
              minHeight: "56px",
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
            marginRight: "10px",
          }}
        >
          Save
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
      </div>

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
            <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>
              Edit Page Numbers and Category
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

            <select
              value={categories.find((category) => category.toLowerCase() === editCategory.toLowerCase()) || editCategory}
              onChange={(e) => {
                const selectedValue = e.target.value;
                const lowerCaseCategories = categories.map(category => category.toLowerCase());
            
                if (lowerCaseCategories.includes(selectedValue.toLowerCase()) &&
                selectedValue !== "Custom") {
                  setCustomCategory3(false);
                  setEditCategory(selectedValue);
                } else if (selectedValue === "Custom"){
                  setEditCategory("");
                  setCustomCategory3(true);
                } else {
                  setCustomCategory3(true);
                  setEditCategory(selectedValue);
                }
              }}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: "16px",
              }}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            
            {customCategory3 && (
              <input
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                placeholder="Enter Custom Category (if any)"
                style={{
                  width: "95%",
                  padding: "10px",
                  marginBottom: "20px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            )}

            <button
              onClick={handleUpdate}
              style={{
                backgroundColor: "#007BFF",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Save Changes
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
      )}

      {popupMessage && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "20px",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          {popupMessage}
        </div>
      )}

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
            <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>
              Add New Page Number
            </h2>

            <input
              type="text"
              value={newPage}
              onChange={(e) => setNewPage(e.target.value)}
              placeholder="Enter Page Number"
              style={{
                width: "95%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />

            <select
              value={customCategory}
              onChange={(e) => e.target.value === "Custom" ? setCustomCategory2(true) : setCustomCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                fontSize: "16px",
              }}
            >
              <option value="">Select Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {customCategory2 && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter Custom Category (if any)"
                style={{
                  width: "95%",
                  padding: "10px",
                  marginBottom: "20px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            )}

            <button
              onClick={handleAdd}
              style={{
                backgroundColor: "#007BFF",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Add Page
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
      )}
    </div>
  );
};

export default DataTableComponent;
