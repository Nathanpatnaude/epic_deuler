import { Link } from 'react-router-dom';
import './style.css';

const Nav = () => {

  return (
    <nav className='m-2' role="navigation" aria-label="main navigation">

      <div id="test" className="navbar-menu columns is-mobile is-shadowless has-background-#ffbc6b">
        <div className=" tabs is-toggle is-toggle-rounded " style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px' }}>
          <ul>
            <li className=""> 
             
          <Link to="/inventory" className="px-3 button navbar-item is-size-3 is-size-6-mobile has-background-#ffbc6b">
          <span className='span-outline'>🏰</span><span className=''>Home</span>
          </Link>

          </li>
          <li>
          <Link to="/fight" className="px-1 navbar-item is-size-3 is-size-6-mobile has-background-#ffbc6b">
          <span className='span-outline'>⚔️</span><span className=''>Fight</span>
          </Link>
          </li>
          <li>
          <Link to="/shop" className="px-3 navbar-item is-size-3 is-size-6-mobile has-background-#ffbc6b">
          <span className='span-outline'>💰</span><span className=''>Shop</span>
          </Link>
          </li>
          </ul>
        </div>

      </div>
    </nav>
  );
};

export default Nav;

