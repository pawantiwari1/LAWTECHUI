import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const Chat = ({ caseDetails }) => {
  const { case_id, client_id, registration_number } = caseDetails;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const columns = [
    
    // {name : "SR"},
    {name: "QA"},
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
    printWindow.document.write('<h1>Chat History</h1>');
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
    messages.forEach((row, index) => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${row.text}</td>`);
      printWindow.document.write('</tr>');
      
    });
    
    printWindow.document.write('</table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };
  useEffect(() => {
    const getChatHistory = async () => {
      try {
        const res = await axios.post(
          // chat/chat_history used
          `${process.env.REACT_APP_API_BASE_URL}qna/chat_history`,
          // `${process.env.REACT_APP_API_BASE_URL}qna`,
          {},
          {
            params: { case_number: case_id, client_id, registration_number },
          }
        );
        const chatHistoryData = res.data.chat_history || [];
        if (chatHistoryData === ""){
          // set "chat history blank"
          
        }
        let chatHistory = [];
        for (const item of chatHistoryData) {
          if (item.query !== undefined ){
          chatHistory.push({ text: item.query, isUser: true });
          chatHistory.push({ text: item.answer, isUser: false });
        }
      }
       
        setMessages(chatHistory);
      } catch (error) {
        toast.error("Something went wrong");
      }
    };
    getChatHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseDetails]);
  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, isUser: true }]);
    try {
      const chatRes = await axios.post(
        // chat was used
        `${process.env.REACT_APP_API_BASE_URL}qna/`,
        {},
        {
          params: {
            query: input,
            case_number: case_id,
            client_id,
            registration_number,
          },
        }
      );
      const resMessage = chatRes.data.answer;
      setMessages((prev) => [...prev, { text: resMessage, isUser: false }]);
      setInput("");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col rounded-lg bg-white p-4 shadow-lg">
      <div class="flex items-center justify-between border-b border-gray-200 bg-white p-4">
        <h1 class="text-2xl font-semibold text-gray-800">
          Chat with Documents
        </h1>
        <p class="text-gray-600">
          {/* Case Reference: XYZ123 - Selected Document : FIR.pdf{" "} */}
        </p>
      </div>

      <br></br>
      <div className="mb-4 flex-1 space-y-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isUser ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-xs rounded-lg px-4 py-2 ${
                message.isUser
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button
          className="rounded-r-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={handleSendMessage}
        >
          Send
        </button>
        &nbsp;&nbsp;&nbsp;
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
        >Print
        </button>
        &nbsp;&nbsp;&nbsp;
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
        <Link  key={case_id} to={`${process.env.REACT_APP_API_BASE_URL}qna/chat_history_download/?client_id=`+ client_id + "&case_number="+case_id + "&download=True"} target="_blank">Download</Link>
        </button>

      </div>
    </div>
  );
};
