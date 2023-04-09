import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { Link } from 'react-router-dom';
import '../components/Nav/style.css';
import { ADD_ACCOUNT, ADD_CHARACTER } from "../utils/gql/mutations";
import { useMutation } from "@apollo/client";
import Inventory from "../pages/Inventory";
import Auth from "../utils/Auth";
import { useNavigate } from "react-router-dom";

var SignUpHeader = "Sign Up";
const Signup = () => {
  const [addCharacter, { error: charError, data: charData }] =
    useMutation(ADD_CHARACTER);

  const [addProfile, { error: profileError, data: profileData }] =
    useMutation(ADD_ACCOUNT);

  // Navigate to Inventory page
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/Inventory`;
    navigate(path);
  };
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  const generateChar = async (name) => {
    try {
      const { data } = await addCharacter({
        variables: { name: name },
      });
      console.log(data);
    } catch (e) {
      console.error(JSON.parse(JSON.stringify(e)));
    }
  };

  const reloadPage = () => {
    window.location.reload();
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addProfile({
        variables: { ...formState },
      });
      console.log(data);

      // console.log(name);
      Auth.login(data.addAccount.token);
      var name = data.addAccount.account.username;
      console.log(name);

      // Generate character
      generateChar(name);
      SignUpHeader = "Welcome!"
      // Change route to Inventory on click
      // routeChange();
      // window.location.reload();

    } catch (e) {
      console.error(JSON.parse(JSON.stringify(e)));
    }

    setFormState({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <main className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="card-body has-text-centered box">
            
            
            {Auth.loggedIn()? (
              
               <div className="is-centered">
                <h4 className="label columns is-centered is-size-1 is-size-6-mobile">
              {SignUpHeader}
            </h4>
               <div onClick={reloadPage} className="button is-info is-size-3 is-size-5-mobile" style={{ color: 'black', textShadow: '2px 2px 10px #ffffff', borderRadius: '40px', borderBottom: '8px', borderBottomStyle: 'solid' }}>
               <span className='span-outline'>🏰</span>View Character
               </div>              
             </div>
               ) : ( 
                
              <form onSubmit={handleFormSubmit}>
                <h1 className="title has-text-centered is-size-2 mb-4 equip" style={{ backgroundColor: '#e6cc80', textShadow: '2px 2px 10px #a335ee', display: 'inline-block', fontSize: '33px', borderRadius: '60px', boxShadow: ' 0 0 8px #999', padding: '0.5em 0.6em', margin:'0px', borderBottom: '16px', borderBottomStyle: 'solid' }}><span className='span-outline'>📜</span></h1>
            
                <div className="column is-12">
                  <div className="field">
                    <label className="label is-size-3 is-size-6-mobile">Username</label>
                    <div className="control">
                      <input
                        className="input is-size-4 is-size-6-mobile"
                        placeholder="Your username"
                        name="username"
                        type="text"
                        value={formState.username}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="field">
                      <label className="label is-size-3 is-size-6-mobile">Email</label>
                      <input
                        className="input is-size-4 is-size-6-mobile"
                        placeholder="Your email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="field is-size-3">
                      <label className="label is-size-3 is-size-6-mobile"> Password</label>
                      <div className="control">
                        <input
                          className="input is-size-4 is-size-6-mobile"
                          placeholder="******"
                          name="password"
                          type="password"
                          value={formState.password}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <button
                      className="button is-info is-size-3 is-size-5-mobile" style={{ color: 'black', textShadow: '2px 2px 10px #ffffff', borderRadius: '40px', borderBottom: '8px', borderBottomStyle: 'solid' }}
                      type="submit"
                    >
                      <span className='span-outline'>✅</span>Sign-Up
                    </button>
                    <div className="is-size-4 is-size-6-mobile mt-4">
                  <Link to="/login" >
                    Already have a character? Login
                  </Link>
                </div>
                  </div>
                </div>
              </form>
            )}{charError && (
              <div className="notification is-danger">{charError.message}</div>
            )}
            
            
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
