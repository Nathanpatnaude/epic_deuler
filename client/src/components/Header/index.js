import { useState, useEffect } from 'react';
import Auth from '../../utils/Auth';
import Nav from '../Nav'
import './style.css'
function Header() {
  // Set isLoggedIn to true or false based on whether the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Set the username to the user's username if they are logged in
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if the user is logged in
    if (Auth.loggedIn()) {
      // Get the user's username from the decoded token
      const profile = Auth.getProfile();
      // Uppercase first letter of username
      const userName = profile.data.username.slice(0, 1).toUpperCase() + profile.data.username.slice(1)
      setUsername(userName);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Code to handle logging out the user goes here
    Auth.logout();
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <div>
      {isLoggedIn ? (<div className="header is-block">
        <nav className="navbar is-primary is-shadowless is-block"role="navigation" aria-label="main navigation" >

          <h1 class="title is-size-1-fullhd has-text-centered">Epic Dueler</h1>


          <div id='userHello' class='is-flex is-align-content-flex-end is-pulled-right is-relative-is-mobile'>

            <div class="subtitle is-size-3 m-3" >
              Hello, {username}!
            </div>
            <div>
              <button class="button is-warning mb-4" onClick={handleLogout}>Logout</button>
            </div>
          </div>

          <div>
            <Nav />
            {/* <Inventory /> */}
          </div>
        </nav>
      </div>
      ) : (
        <div class="has-text-centered has-background-primary">

          <div class='intro p-5'>
            <h1 class='title is-size-2-fullhd pb-6 pt-5'>Epic Dueler</h1>
          </div>
        </div>
      )}

    </div>

  );
};

export default Header;
