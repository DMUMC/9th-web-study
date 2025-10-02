import { Outlet } from 'react-router-dom'
import { NavBar } from '../components/NavBar'

function HomePage() {
  return (
    <>
      <NavBar />
      <Outlet />
      <div className='flex justify-center'>Homepage</div>
    </>
  )
}

export default HomePage