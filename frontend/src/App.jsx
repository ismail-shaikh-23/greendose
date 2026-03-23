import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import getRouter from "./routes";

const App = () => {
  const { permissions } = useSelector((state) => state.global); // or wherever you store it
  const router = useMemo(() => getRouter(permissions), [permissions]);
  return (
    <div>
      <RouterProvider router={createBrowserRouter(router)} />
    </div>
  );
};

export default App;
