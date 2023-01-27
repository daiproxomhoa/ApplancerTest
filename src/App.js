import React from "react";
import { useRoutes } from "react-router";
import "./App.css";
import DefaultLayout from "./DefaultLayout";
import DetailPage from "./page/DetailPage";
import ListPage from "./page/ListPage";

function App() {
  const element = useRoutes([
    {
      path: "/*",
      element: <DefaultLayout />,
      children: [
        {
          index: true,
          element: <ListPage />,
        },
        {
          path: ":id",
          element: <DetailPage />,
        },
      ],
    },
  ]);
  return <React.Suspense fallback={"loading..."}>{element}</React.Suspense>;
}

export default App;
