import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";
import { useState } from "react";
import axios from "axios";
import {Navigate, useNavigate }  from "react-router-dom"

import setAuthToken from 'views/auth/auth_service'
import { toast } from "react-toastify";

export default function SignIn() {
  const [email , setName] = useState()
  const [password , setPassword] = useState()
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const name = ""
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    
    console.log(e)

    // setPassword(name)

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}signin`,
        {
          name,
          email,
          password,
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.detail || "Something went wrong");
      }
      console.log(response.data)

      if (response.data.authenticated === "True" ){
        console.log("User signed up with user_id:", response);
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', JSON.stringify(response.data.id));
        // setAuthToken(response.data.id)
        const date = new Date()
        date.setHours(date.getHours() + 5);
        localStorage.setItem("tokenExpiry", date)
        navigate('/admin'); 
      }else{
        toast.error(response.data.status)
      }


      // console.log("User signed up with user_id:", response.data.user_id);
    

      // Redirect to login page or display success message
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.detail || error.message);
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        {/* <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
          <div className="rounded-full text-xl">
            <FcGoogle />
          </div>
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            Sign In with Google
          </h5>
        </div>
        <div className="mb-6 flex items-center  gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white"> or </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div> */}
        {/* Email */}
        <form onSubmit={handleSignIn}>
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@simmmple.com"
          id="email"
          type="text"
          value={email}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Checkbox */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
              Keep me logged In
            </p>
          </div>
          <a
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            href=" "
          >
            Forgot Password?
          </a>
        </div>
        <button className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
          Sign In
        </button>
        </form>
        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <a
            href="/auth/sign-up"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
