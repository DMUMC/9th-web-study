import './App.css'
import Header from './components/Header'
import { Route } from './router/Route'
import { Routes } from './router/Routes'


const MainPage = () => <h1>Main Page</h1>
const AboutPage = () => <h1>About Page</h1>
const ContactPage = () => <h1>Contact Page</h1>
const NotFoundPage = () => <h1>404 Not Found</h1>

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" component={MainPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="*" component={NotFoundPage} />
      </Routes>
    </>
  )
}

export default App
