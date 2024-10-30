import React, { useState, useEffect } from "react";
import Card from "components/card";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { MdDelete, MdEditNote, MdPreview } from "react-icons/md";

const ViewClassifications = () => {
    const { client_id, case_id } = useParams();
    console.log(useParams)
  return <div>
        <h1>{client_id} : { case_id}</h1>
    </div>
};

export default ViewClassifications;
