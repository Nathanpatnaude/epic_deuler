import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { LOGIN } from "../utils/gql/mutations";
import Auth from "../utils/Auth";
import { useNavigate } from "react-router-dom";


const Login = (props) => {
  const [formState, setFormState] = useState({ username: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN);

  // Update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Navigate to Inventory page 
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/Inventory`;
    navigate(path);
  }

  // Submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });
      console.log({ data });
      Auth.login(data.login.token);

      // Change route to Inventory on click
      routeChange();
      window.location.reload();

    } catch (e) {
      console.error(JSON.parse(JSON.stringify(e)));
    }

    // Clear form values 
    setFormState({
      username: "",
      password: "",
    });
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <form onSubmit={handleFormSubmit}>
              <div className="column is-12">
                <div className="field">
                  <label className="label is-size-1 is-size-6-mobile">Username</label>
                  <div className="control">
                    <input
                      className="input is-size-4 is-size-6-mobile"
                      type="test"
                      placeholder="Your Username"
                      name="username"
                      value={formState.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label is-size-1 is-size-6-mobile">Password</label>
                  <div className="control">
                    <input
                      className="input is-size-4 is-size-6-mobile"
                      type="password"
                      placeholder="******"
                      name="password"
                      value={formState.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <button
                      className="button is-info is-large is-size-6-mobile"
                      style={{ cursor: "pointer" }}
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <div className="is-size-4 is-size-6-mobile">
                  <Link to="/signup" >
                    Create A New Character
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div> </section>
    </>
  );
};

export default Login;
