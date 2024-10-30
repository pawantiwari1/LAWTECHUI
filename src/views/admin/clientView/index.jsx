import React, { useState } from "react";
import AddClient from "./components/addClient";
import ViewClient from "./components/viewClient";

const ClientView = () => {
  
  return (
    <div>
      
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-1">
        <AddClient/>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-1 ">
        <ViewClient/>
      </div>

    </div>
  );
};

export default ClientView;
