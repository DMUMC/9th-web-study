import './App.css';
import { Router } from './router/Router';
import { Route } from './router/Route';
import { Link } from './router/Link';
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import AboutPage from './pages/AboutPage';

const Header = () => {
    return (
        <nav className='flex gap-2.5'>
            <Link to='/'>Home</Link>
            <Link to='/user'>User</Link>
            <Link to='/about'>About</Link>
        </nav>
    );
};

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
