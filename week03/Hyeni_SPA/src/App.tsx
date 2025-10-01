import './App.css';
import { Header } from './components/Header';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import Route from './routes/Route';
import Routes from './routes/Router';


function App() {
  return (
    <>
      <Header />
      <h1>HYENI</h1>
      <Routes>
        <Route path='/HomePage' component={HomePage} />
        <Route path='/AboutPage' component={AboutPage} />
      </Routes>
    </>
  );
}

export default App;