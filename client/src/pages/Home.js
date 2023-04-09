import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-6">
            <div className="box has-text-centered" style={{ backgroundColor: '#ffffff' }}>
              <h1 className="fromtop title has-text-centered is-size-2 mb-4 equip" 
              style={{ backgroundColor: '#e6cc80', textShadow: '2px 2px 10px #a335ee', display: 'inline-block', fontSize: '33px', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', margin:'0px', borderBottom: '16px', borderBottomStyle: 'solid' }}>
                <span className='span-outline'>⚔️</span></h1>
              <h2 className="title has-text-centered">Welcome to Epic Dueler</h2>
              <div className="buttons is-centered">
                <Link to="/login" className="button is-primary is-size-3 is-size-5-mobile" style={{ color: 'black', textShadow: '2px 2px 10px #ffffff', borderRadius: '40px', borderBottom: '8px', borderBottomStyle: 'solid' }}><span className='span-outline'>✅</span>
                  Login
                </Link>
                <Link to="/signup" className="button is-info is-size-3 is-size-5-mobile" style={{ color: 'black', textShadow: '2px 2px 10px #ffffff', borderRadius: '40px', borderBottom: '8px', borderBottomStyle: 'solid' }}>
                <span className='span-outline'>📜</span>Sign-Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;


