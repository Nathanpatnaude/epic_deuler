import { Link } from 'react-router-dom';
import './style.css';

const Nav = () => {
  return (
    <nav className='m-2' role="navigation" aria-label="main navigation">

      <div id="test" className="navbar-menu columns is-mobile is-shadowless has-background-#ffbc6b">
        <div className="navbar-start is-centered">
          <Link to="/inventory" className="navbar-item is-size-3 has-background-#ffbc6b">
            Inventory
          </Link>
          <Link to="/fight" className="navbar-item is-size-3 has-background-#ffbc6b">
            Fight
          </Link>
          <Link to="/shop" className="navbar-item is-size-3 has-background-#ffbc6b">
            Shop
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Nav;

