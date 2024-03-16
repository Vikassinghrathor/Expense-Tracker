import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import WelcomePage from './pages/WelcomePage';
// import { useContext } from 'react';
// import AuthContext from  './store/auth-context';

function App() {
  return (
    // <AuthContext>
    <Router>
      <Route path="/" exact>
        <Redirect to="/login" />
      </Route>
      <Route path="/login" component={AuthPage} />
      <Route path="/welcome" component={WelcomePage} />
    </Router>
    // </AuthContext>
  );
}

export default App;
