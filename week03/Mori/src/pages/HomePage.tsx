import { Outlet } from 'react-router-dom'
import { NavBar } from '../components/NavBar'

function HomePage() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}

export default HomePage