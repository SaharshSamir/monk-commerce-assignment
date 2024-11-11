import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div className="bg-white w-full h-full flex justify-center">
      <Outlet />
    </div>
  )
};
