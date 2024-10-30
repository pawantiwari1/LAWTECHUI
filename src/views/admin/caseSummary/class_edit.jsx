import React, { useState, useEffect } from 'react';
import axios from "axios";
import Card from "components/card";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
// Sample object data for initializing the form


  const DynamicEditForm = ({ data, onSubmit }) => {
    // Assuming we are editing the first object for this example
    const [formData, setFormData] = useState(data[1] || {});
    
    useEffect(() => {
      setFormData(data[1] || {});
    }, [data]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(formData);
      }
    };
  
    return (
      
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((row,key) => (
          key !== 'id' && ( // Exclude fields you don't want to edit, e.g., 'id'
            <div key={row}>
              <label>{key}:</label>
              <input
                type={typeof formData[key] === 'number' ? 'number' : 'text'}
                name={key}
                value={formData[row]|| ''}
                onChange={handleChange}
              />
            </div>
          )
          
        ))}
        {/* {Object.keys(formData).forEach(function(key, index) {
              console.log(`${key} : ${formData[key]}`)
              <input
              name=`${key}`
              value=`${formData[key]}`
              onChange={handleChange}
            ></input>
        })}; */}
        <button type="submit">Save</button>
        

      </form>
    );
  };
  
  // Usage Example
  const App = () => {
    const dataArray = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', age: 30, address: '123 Main St' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', age: 25, address: '456 Elm St' }
      ];
    const handleFormSubmit = (data) => {
      console.log('Form submitted with data:', data);
    };
  
    return (
      <div>
        <h1>Edit User K</h1>
        <DynamicEditForm data={dataArray} onSubmit={handleFormSubmit} />
      </div>
    );
  };
  
  export default App;
  