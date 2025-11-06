import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { WelcomeData } from './components/UserDataDisplay'

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <WelcomeData />
    </QueryClientProvider>
  )
}

export default App
