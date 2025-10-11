import { Outlet } from "react-router-dom"
import { Navbar } from "../components/Navbar"

export const MainPage = () => {
  return (
    <>
        <Navbar />
        <Outlet />
    </>
  )
}
