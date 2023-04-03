// Import statement of three modules from the @apollo/client package
// Import statement of three modules from the react-router-dom package for client-side routing
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';

// Import component
import {  Footer, Header, NotFound } from './components';
import { Home, Battle, Inventory, Fight, Login, Shop, Signup } from './pages'


const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Entry point. Defines the structure and layout 
function App() {
    return (
      <ApolloProvider client={client}>
        <Router>
        <div className="flex-column justify-flex-start min-100-vh">
            <Header />
            <div className="container" style={{padding:"15px", maxWidth: '1385px' }}>
              <Routes>
                <Route 
                  path="/" 
                  element={<Home />} 
                />
                <Route 
                  path="/login" 
                  element={<Login />} 
                />
                 <Route 
                  path="/signup" 
                  element={<Signup />} 
                />
                 <Route 
                  path="/inventory" 
                  element={<Inventory />} 
                />
                  <Route 
                  path="/fight" 
                  element={<Fight />} 
                />
                  <Route 
                  path="/shop" 
                  element={<Shop />} 
                />
                   <Route 
                  path="/battle" 
                  element={<Battle />} 
                />
                    <Route 
                  path="*" 
                  element={<NotFound />} 
                />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </ApolloProvider>
    );
  }
  export default App;