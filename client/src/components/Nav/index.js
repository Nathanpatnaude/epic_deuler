import { Link } from 'react-router-dom';
import './style.css';

const Nav = () => {

  return (
    <nav className='m-2' role="navigation" aria-label="main navigation">

      <div id="test" className="navbar-menu columns is-mobile is-shadowless has-background-#ffbc6b">
        <div className=" tabs is-toggle is-toggle-rounded " style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px' }}>
          <ul>
            <li className=""> 
             
          <Link to="/inventory" className="button navbar-item is-size-3 is-size-6-mobile has-background-#ffbc6b">
          🏰Home
          </Link>

          </li>
          <li>
          <Link to="/fight" className=" navbar-item is-size-3 is-size-6-mobile has-background-#ffbc6b">
          ⚔️Fight
          </Link>
          </li>
          <li>
          <Link to="/shop" className="navbar-item is-size-3 is-size-6-mobile has-background-#ffbc6b">
          💰Shop
          </Link>
          </li>
          </ul>
        </div>

      </div>
    </nav>
  );
};

export default Nav;

