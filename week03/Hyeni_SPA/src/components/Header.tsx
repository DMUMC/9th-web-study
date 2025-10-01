import { Link } from "../routes/Link";

export const Header = () => {
  return (
    <nav style={{ display: 'flex', gap: '10px' }}>
      <Link to='/HomePage'>Home</Link>
      <Link to='/AboutPage'>About</Link>
    </nav>
  );
};