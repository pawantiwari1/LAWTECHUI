import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import ClientView from "views/admin/clientView";

// Auth Imports
import SignIn from "views/auth/SignIn";
import SignUp from "views/auth/SignUp";

// Icon Imports
import {
  MdHome,
  MdArrowRightAlt,
  MdLock,
  MdLibraryBooks,
  MdCases,
  MdAppRegistration,
  MdPageview,
} from "react-icons/md";
import RegisterCase from "views/admin/caseRegister";
import CaseView from "views/admin/caseView";
import LegalNoticeView from "views/admin/caseView/components/LegalNoticeView";
import LitigationView from "views/admin/caseView/components/LitigationView";
import LegalOpinionView from "views/admin/caseView/components/LegalOpinionView";
import MiscView from "views/admin/caseView/components/MiscView";
import AddClient from "views/admin/clientView/components/addClient";
import ViewClient from "views/admin/clientView/components/viewClient";
import ViewDashboard from "views/admin/dashboard";
import ClientProfile from "views/admin/clientProfile";
import CaseProfile from "views/admin/caseProfile";
import ClassProfile from "views/admin/classtProfile";
import ViewClassifications from "views/admin/caseClassification/index"
import ViewSummary from "views/admin/caseSummary/index";
// import ViewClassifications from "views/admin/caseClassification/component/viewClassifications"
// import ViewClassifications from "views/admin/caseClassification/component/viewClassifications"
const routes = [
  // {
  //   name: "Main Dashboard",
  //   layout: "/admin",
  //   path: "default",
  //   icon: <MdHome className="h-6 w-6" />,
  //   component: <MainDashboard />,
  // },
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <ViewDashboard />,
  },
  
  {
    name: "Client Book",
    layout: "/admin",
    path: "client-book",
    icon: <MdLibraryBooks className="h-6 w-6" />,
    component: null,
    children: [
      {
        name: "Add New Client",
        path: "add-client",
        icon: <MdArrowRightAlt className="h-5 w-5" />,
        component: <AddClient />,
      },
      {
        name: "View Client",
        path: "view-client",
        icon: <MdArrowRightAlt className="h-5 w-5" />,
        component: <ViewClient />,
      },
      
    
    ],
  },
  {
    name: "Case Register",
    layout: "/admin",
    path: "case-register",
    icon: <MdAppRegistration className="h-6 w-6" />,
    component: <RegisterCase />,
  },
  // {
  //   name: "Case View",
  //   layout: "/admin",
  //   path: "case-view",
  //   icon: <MdPageview className="h-6 w-6" />,
  //   component: null,
  //   children: [
  //     {
  //       name: "Legal Notice",
  //       path: "legal-notice-view",
  //       component: <LegalNoticeView />,
  //       icon: <MdArrowRightAlt className="h-5 w-5" />,
  //     },
  //     {
  //       name: "Litigation",
  //       path: "litigation-view",
  //       component: <LitigationView />,
  //       icon: <MdArrowRightAlt className="h-5 w-5" />,
  //     },
  //     {
  //       name: "Legal Opinion",
  //       path: "legal-opinion-view",
  //       icon: <MdArrowRightAlt className="h-5 w-5" />,
  //       component: <LegalOpinionView />,
  //     },
  //     {
  //       name: "Miscelleneous",
  //       path: "misc-view",
  //       icon: <MdArrowRightAlt className="h-5 w-5" />,
  //       component: <MiscView />,
  //     },
  //   ],
  // },
];

const nonSidebarRoutes = [
  {
    name: "Client Profile",
    layout: "/admin",
    path: "client-book/view-client/client-details/:client_id",
    component: <ClientProfile />,
  },
  {
    name: "Case Profile",
    layout: "/admin",
    path: "/case-profile/:case_id",
    component: <CaseProfile />,
  },
  {
    name: "Case Classification",
    layout: "/admin",
    path: "classfications/:client_id/:case_id/:doc_id",
    icon: <MdHome className="h-6 w-6" />,
    component: <ViewClassifications />,
  },
  {
    name: "Document Summary",
    layout: "/admin",
    path: "summary/:client_id/:case_id/:doc_id",
    icon: <MdHome className="h-6 w-6" />,
    component: <ViewSummary />,
  },
  
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignUp />,
  },
];

export { routes, nonSidebarRoutes };
