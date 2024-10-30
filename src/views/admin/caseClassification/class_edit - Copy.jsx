import axios from "axios";
import Card from "components/card";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ClassEdit = ({caseDetails}) => {
    const { case_id, client_id } = caseDetails;

    const handleSubmit = async (docId) => {
    }
    const handleChange = async (docId) => {
    }

    console.log("classify" + caseDetails.client_id + "/" + caseDetails.case_id)
    const xx =  new Date().getTime()
    const d  =   "http://localhost:8000/file_preview/?file_path=1.pdf.pdf&" + xx
    console.log(d)
    return (
    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-1">
      <Card extra="w-full pb-10 p-4 h-full">
        <header className="relative flex items-center justify-between">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Edit Classification
          </div>
        </header>
        
        <form onSubmit={'addClient'}>
              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Client Name*
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Case ID"
                  required
                  value={case_id}
                  onChange={handleChange}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Client ID*
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter client's name"
                  required
                  value={client_id}
                  onChange={handleChange}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none"
                />
              </div>
</form>
</Card>
</div>
)
};

export default ClassEdit;