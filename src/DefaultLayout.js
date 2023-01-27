import { Outlet } from "react-router";

const DefaultLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white">
      <Outlet />
    </div>
  );
};
export default DefaultLayout;
