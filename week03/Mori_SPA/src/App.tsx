import { Router } from './router/Router';
import { Route } from './router/Route';
import { Link } from './router/Link';

const HomePage = () => <h1>홈</h1>;
const AboutPage = () => <h1>소개</h1>;
const NotFoundPage = () => <h1>404: 페이지를 찾을 수 없습니다.</h1>;

function App() {
  return (
    <Router>
      <nav className='p-4 flex gap-8 border-y-2 border-[#ccc]'>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to='/not-found'>NOT FOUND</Link>
      </nav>

      <main className='p-4'>
        <Route path="/" component={HomePage} />
        <Route path="/about" component={AboutPage} />
        <Route path='/not-found' component={NotFoundPage} />
      </main>
    </Router>
  );
}

export default App;