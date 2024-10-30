import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar/index";
import Footer from "components/footer/Footer";
import { routes, nonSidebarRoutes } from "routes.js";
import ClientProfile from "views/admin/clientProfile";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

  // React.useEffect(() => {
  //   window.addEventListener("resize", () =>
  //     window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
  //   );
  // }, []);
  React.useEffect(() => {
    getActiveRoute([...routes, ...nonSidebarRoutes]);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes.flatMap((prop, key) => {
      if (prop.layout === "/admin") {
        if (!prop.children) {
          return (
            <Route path={`/${prop.path}`} element={prop.component} key={key} />
          );
        } else {
          return [
            <Route path={`/${prop.path}`} element={prop.component} key={key} />,
            prop.children.map((child, idx) => (
              <Route
                key={`${prop.path}-${child.path}`}
                path={`/${prop.path}/${child.path}`}
                element={child.component}
              />
            )),
          ];
        }
      }
      return null;
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <div className="h-full w-1/5">
        <Sidebar open={open} onClose={() => setOpen(false)} />
      </div>
      {/* Navbar & Main Content */}
      <div className="h-full w-4/5 bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main className="mx-[12px] h-full w-[calc(100%-24px)] flex-none transition-all">
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Lawtech"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}
                {nonSidebarRoutes.map((route, index) => (
                  <Route
                    key={index}
                    path={`/${route.path}`}
                    element={route.component}
                  />
                ))}
                <Route
                  path="/"
                  element={<Navigate to="/admin/default" replace />}
                />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
