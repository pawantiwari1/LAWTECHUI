import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";

export function SidebarLinks({ routes }) {
  let location = useLocation();
  const [openRoutes, setOpenRoutes] = useState({});

  const activeRoute = (routeName) => location.pathname.includes(routeName);

  const toggleCollapse = (routeName) => {
    setOpenRoutes((prev) => ({
      ...prev,
      [routeName]: !prev[routeName],
    }));
  };

  const handleLinkClick = (event, route) => {
    if (route.children) {
      event.preventDefault();
      toggleCollapse(route.path);
    }
  };

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.layout === "/admin" || route.layout === "/auth" || route.layout === "/rtl") {
        return (
          <React.Fragment key={index}>
            <Link to={route.layout + "/" + route.path} onClick={(event) => handleLinkClick(event, route)}>
              <div className="relative mb-3 flex hover:cursor-pointer">
                <li className="my-[3px] flex cursor-pointer items-center px-8">
                  <span className={`${activeRoute(route.path) ? "font-bold text-brand-500 dark:text-white" : "font-medium text-gray-600"}`}>
                    {route.icon ? route.icon : <DashIcon />}{" "}
                  </span>
                  <p className={`leading-1 ml-4 flex ${activeRoute(route.path) ? "font-bold text-navy-700 dark:text-white" : "font-medium text-gray-600"}`}>
                    {route.name}
                  </p>
                </li>
                {activeRoute(route.path) && <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />}
              </div>
            </Link>
            {route.children && openRoutes[route.path] && (
              <ul className="ml-8">
                {route.children.map((child, idx) => (
                  <Link key={idx} to={route.layout + "/"+ route.path+ "/"+ child.path}>
                    <li className="my-[3px] flex cursor-pointer items-center px-8">
                    <span className={`${activeRoute(child.path) ? "font-bold text-brand-500 dark:text-white" : "font-medium text-gray-600"}`}>
                    {child.icon ? child.icon : <DashIcon />}{" "}
                  </span>
                      <p className={`leading-1 ml-4 flex ${activeRoute(child.path) ? "font-bold text-navy-700 dark:text-white" : "font-medium text-gray-600"}`}>
                        {child.name}
                      </p>
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </React.Fragment>
        );
      }
      return null;
    });
  };

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
