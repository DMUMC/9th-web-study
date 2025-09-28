import Navbar from '../component/Navbar'
import ThemeContent from '../component/ThemeContent'
import { ThemeProvider } from '../context/ThemeProvider'

export default function ContextPage() {


  return (
    <ThemeProvider>
      <div className='flex flex-col items-center min-h-screen'>
        <Navbar />
        <main className='flex-1 w-full'>
          <ThemeContent />
        </main>
      </div>
    </ThemeProvider>
  )
}
