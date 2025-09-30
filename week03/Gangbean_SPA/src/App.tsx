import './App.css';
import { Router } from './router/Router';
import { Route } from './router/Route';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import AboutPage from './pages/AboutPage';

function App() {
    return (
        <>
            <Header />
            <Router>
                <Route path='/' component={HomePage} />
                <Route path='/user' component={UserPage} />
                <Route path='/about' component={AboutPage} />
            </Router>
        </>
    );
}

export default App;
