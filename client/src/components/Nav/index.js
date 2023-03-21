import { Link } from 'react-router-dom';
import './style.css';

const Nav = () => {
  return (
    <nav class='m-2' role="navigation" aria-label="main navigation">

      <div id="test" class="navbar-menu columns is-mobile is-shadowless has-background-#ffbc6b">
        <div class="navbar-start is-centered">
          <Link to="/inventory" class="navbar-item is-size-3 has-background-#ffbc6b">
            Inventory
          </Link>
          <Link to="/fight" class="navbar-item is-size-3 has-background-#ffbc6b">
            Fight
          </Link>
          <Link to="/shop" class="navbar-item is-size-3 has-background-#ffbc6b">
            Shop
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Nav;

