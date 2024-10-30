import React, { useState } from "react";
import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";
import {Navigate, useNavigate }  from "react-router-dom"

import axios from "axios";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [password1, setPassword1] = useState("kaladhar");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function setNameK(e){
    alert(e.target.value)
  }
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    
    console.log(e)

    // setPassword(name)
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}signup`,
        {
          name,
          email,
          password,
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.detail || "Something went wrong");
      }

      console.log("User signed up with user_id:", response.data.user_id);
      // Navigate("/admin")
      navigate('/admin'); 

      // Redirect to login page or display success message
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.detail || error.message);
    }
  };

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign Up
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Create your account to get started!
        </p>

        {error && <p className="mb-4 text-red-500">{error}</p>}

        <form onSubmit={handleSignUp}>
          {/* Name */}

          {/* <div>
            <label>Kaladhar</label>
            <input type="text" name="name" value="" onChange={(e) => setName(e.target.value)}/>
          </div>
           */}
          <InputField
            // variant="auth"
            extra="mb-3"
            label="Name*"
            placeholder="Your Name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            // onChange={e => this.handleChangeK(e.target.value)}
            // onChange={(e) => setName(e.target.value)}
            // onInput={(e) => setNameK(e.target.value)}
            // onChange={handleChangeK}
          />

          {/* Email */}
          <InputField
            // variant="auth"
            extra="mb-3"
            label="Email*"
            placeholder="mail@simmmple.com"
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <InputField
            // variant="auth"
            extra="mb-3"
            label="Password*"
            placeholder="Min. 8 characters"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Confirm Password */}
          <InputField
            // variant="auth"
            extra="mb-4"
            label="Confirm Password*"
            placeholder="Confirm your password"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            on
          />

          {/* Checkbox */}
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">
              <Checkbox
                checked={agreeToTerms}
                onChange={() => setAgreeToTerms(!agreeToTerms)}
              />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                I agree to the terms and conditions
              </p>
            </div>
          </div>
          <button type="submit" className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            Sign Up
          </button>
        </form>
        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Already have an account?
          </span>
          <a
            href="/auth/sign-in"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Name:{name}<br/>
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
