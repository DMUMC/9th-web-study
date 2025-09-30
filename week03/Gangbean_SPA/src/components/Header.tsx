import { Link } from '../router/Link';

const Header = () => {
    return (
        <nav className='flex gap-2.5'>
            <Link to='/'>Home</Link>
            <Link to='/user'>User</Link>
            <Link to='/about'>About</Link>
        </nav>
    );
};

export default Header;
