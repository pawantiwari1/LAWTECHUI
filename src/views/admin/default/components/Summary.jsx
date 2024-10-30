import React, { useState, useEffect, useCallback, useRef } from "react";
import Card from "components/card"; // Assuming Card is a component that displays content
import axios from "axios";

const processSummary = (rawSummary) => {
  const summaryParts = rawSummary.split(/[\n\r]+|:\s+/);
  const formattedSummary = [];

  summaryParts.forEach((part) => {
    part = part.trim();
    if (part.includes(":")) {
      const [label, content] = part.split(":");
      formattedSummary.push({ label: label.trim(), content: content.trim() });
    } else {
      if (/^\d+\.\s+/.test(part)) {
        formattedSummary.push({ content: `<b>${part}</b>` });
      } else {
        const lastItem = formattedSummary[formattedSummary.length - 1];
        if (lastItem && lastItem.label) {
          lastItem.content += `\n  * ${part}`;
        } else {
          formattedSummary.push({ content: part });
        }
      }
    }
  });

  return formattedSummary;
};

const Summary = () => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const summaryRef = useRef(null); // Reference for the summary content

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}summarize-case-documents/`
      ); // Replace with your FastAPI endpoint
      const rawSummary = response.data.summary;
      const formattedSummary = processSummary(rawSummary);
      setSummary(formattedSummary);
    } catch (error) {
      console.error(error);
      setError("Error fetching summary. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isButtonClicked) {
      fetchData();
    }
  }, [isButtonClicked, fetchData]);

  const handleClick = () => {
    setIsButtonClicked(true);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Summary</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            ul { text-align: left; }
            b { font-weight: bold; }
          </style>
        </head>
        <body>
          ${summaryRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card extra="!p-[20px] text-center">
      <div className="items-left flex flex-col">
        <div>
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="ml-2 rounded-md border border-blue-500 px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-blue-500 hover:text-white"
          >
            {isLoading ? "Loading..." : "Get Summary"}
          </button>
        </div>
        <div ref={summaryRef}>
          {error && <p className="text-red-500">{error}</p>}
          {summary && (
            <>
              <ul style={{ textAlign: "left" }}>
                {summary.map((item, index) => (
                  <li key={index}>
                    {item.label && <b>{item.label}:</b>}
                    <span dangerouslySetInnerHTML={{ __html: item.content }} />
                  </li>
                ))}
              </ul>
              <button
                onClick={handlePrint}
                className="mt-4 rounded-md border border-green-500 px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-green-500 hover:text-white"
              >
                Print Summary
              </button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Summary;
