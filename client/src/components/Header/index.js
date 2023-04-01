import { useState, useEffect } from 'react';
import Auth from '../../utils/Auth';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Nav from '../Nav'
import { QUERY_ME } from "../../utils/gql/queries";
import { useQuery } from "@apollo/client";
import './style.css'

var gold;
var rating;

function Header() {
  const { loading, data, error } = useQuery(QUERY_ME);
  // Set isLoggedIn to true or false based on whether the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Set the username to the user's username if they are logged in
  const [username, setUsername] = useState('');

  const getPlayerIcon = (icon, slot) => {
    if (icon === '🚫' && slot === 'weapon') {
      return '👊';
    } else if (icon === '🚫' && slot === 'armor') {
      return '👶';
    } else {
      return icon;
    };
  };
  useEffect(() => {
    // Check if the user is logged in
    if (Auth.loggedIn()) {
      // Get the user's username from the decoded token
      const profile = Auth.getProfile();
      // Uppercase first letter of username
      console.log(profile);
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
  if (isLoggedIn) {

    if (data) {
      gold = data.me.gold;
      rating = data.me.rating;
    }
  }
  return (
    <div>
      {data ? (<div className="header is-block">
        <nav className="navbar is-primary is-shadowless is-block columns" role="navigation" aria-label="main navigation" >
          <div className="columns is-mobile is-gapless">
            <h1 className="tittle  p-0">Epic Dueler</h1>
            <div className='column'></div>
            <div className=' has-text-right'>
              <div className="button is-size-4 is-size-6-mobile columns is-mobile p-1" style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px' }} >
                <div >
                  <Badge className='is-pulled-left is-size-6-mobile' style={{ display: 'inline-block', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.2em 0.6em', margin: '0px' }}>{rating}</Badge>
                </div>
                {getPlayerIcon(data.me.inventory.armor.icon, 'armor')}
                {getPlayerIcon(data.me.inventory.weapon.icon, 'weapon')}
                <span className='username'>
                  {username}
                </span>

                <Button className='is-size-6-mobile is-size-4' style={{ backgroundColor: '#0070dd', textShadow:'2px 2px 10px #ffffff', borderRadius: '40px', alignItems: 'center', width: 'fit-content', display: 'initial', }} >{gold}💎</Button>
              </div>
            </div>
          </div>
          <div className="columns is-flex is-gapless">
            <div className="column">
              <Nav />
              {/* <Inventory /> */}

            </div>
            <div className="has-text-right column">
              <div className="button logout navbar-item is-pulled-right is-size-4 is-size-6-mobile pl-1 pr-1 pt-1 has-background-#ffbc6b" onClick={handleLogout} style={{ border: '4px solid rgba(1, 1, 1, 1)', borderRadius: '40px' }}>Logout</div>

            </div>
          </div>
          {/* <div id='userHello' className='is-flex column'>

            
          </div> */}


        </nav>

      </div>
      ) : (
        <div className="has-text-centered has-background-primary">

          <div className='intro p-5'>
            <h1 className='tittle pb-4'>Epic Dueler</h1>
          </div>
        </div>
      )}

    </div>

  );
};

export default Header;
