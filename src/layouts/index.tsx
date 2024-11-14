import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="bg-white w-full p-4 h-full">
      <Outlet />
    </div>
  )
};
