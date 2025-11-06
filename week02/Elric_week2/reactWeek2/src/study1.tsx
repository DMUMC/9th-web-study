import './App.css';
// 파일명과 동일하게 소문자로 import
import List, { type Tech } from './components/list';

function App() {
  const nickname = '매튜';
  const sweetPotato = '고구마';
  const array: Tech[] = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE'];

  return (
    <>
      <strong className='school'>상명대학교</strong>
      <p
        style={{
          color: 'purple',
          fontWeight: 'bold',
          fontSize: '3rem',
        }}
      >
        {nickname}/김용민
      </p>
      <h1>{`${nickname}는 ${sweetPotato} 아이스크림을 좋아합니다.`}</h1>
      <ul>
        {array.map((yaho, idx) => (
          <List key={idx} tech={yaho} />
        ))}
      </ul>
    </>
  );
}

export default App;
