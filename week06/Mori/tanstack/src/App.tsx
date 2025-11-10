import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WelcomeData } from './components/WelcomeData'

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <WelcomeData />
      </div>
    </QueryClientProvider>
  )
}

export default App