import './App.css';
import { Router } from './router/Router';
import { Route } from './router/Route';
import { Link } from './router/Link';

const HomePage = () => <h1>Home Page</h1>;
const UserPage = () => <h1>User Page</h1>;

const Header = () => {
    return (
        <nav style={{ display: 'flex', gap: '10px' }}>
            <Link to='/'>Home</Link>
            <Link to='/user'>User Page</Link>
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
            </Router>
        </>
    );
}

export default App;
