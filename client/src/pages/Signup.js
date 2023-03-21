import React, { useState } from "react";
import { ADD_ACCOUNT, ADD_CHARACTER } from "../utils/gql/mutations";
import { useMutation } from "@apollo/client";
import Inventory from "../pages/Inventory";
import Auth from "../utils/Auth";
import { useNavigate } from "react-router-dom";

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

      // Change route to Inventory on click
      routeChange();
      window.location.reload();

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
          <div className="card-body">
            <h4 className="label columns is-centered is-size-1 is-size-6-mobile">
              Sign Up
            </h4>
              <form onSubmit={handleFormSubmit}>
                <div className="column is-12">
                  <div className="field">
                    <label className="label is-size-1 is-size-6-mobile">Username</label>
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
                      <label className="label is-size-1 is-size-6-mobile">Email</label>
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
                      <label className="label is-size-1 is-size-6-mobile"> Password</label>
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
                      className="button is-info is-large is-size-6-mobile"
                      style={{ cursor: "pointer" }}
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            {charError && (
              <div className="notification is-danger">{charError.message}</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
