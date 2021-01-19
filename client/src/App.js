import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import ClientRoute from "./Components/PrivateRoute/ClientRoute";
import Home from "./pages/Home/Home";
import Navbar from "./Components/Navbar/Navbar";

import SignIn from "./pages/SignIn/SignIn";
import ScanCode from "./Components/ScanCode/ScanCode";
import "./App.css";
import AdminSection from "./pages/AdminSection/AdminSection";
import OwnerSection from "./pages/OwnerSection/OwnerSection";
import WorkerSection from "./pages/WorkerSection/WorkerSection";
import ClientPage from "./pages/ClientPage/ClientPage";
import MyOrder from "./pages/MyOrder/MyOrder";

function App() {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  return (
    <div className="app">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/signin">
            <SignIn />
          </Route>
          <Route exact path="/scan-code">
            <ScanCode />
          </Route>
          <ClientRoute path="/client-page">
            <ClientPage />
          </ClientRoute>

          <PrivateRoute exact path="/admin-section">
            <AdminSection />
          </PrivateRoute>
          <PrivateRoute path="/owner-section">
            <OwnerSection />
          </PrivateRoute>
          <PrivateRoute path="/worker-section">
            <WorkerSection />
          </PrivateRoute>
          <Redirect to="/" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
