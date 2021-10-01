import logo from "./logo.svg";
import "./App.css";
import LandingPage from "./pages/Landing.page";
import { Route, Switch } from "react-router-dom";
import SignIn from "./pages/SignIn.page";
import Auth from "./pages/Auth.page";
import { useEffect, useState } from "react";
import { supabase } from "./Helpers/supabase";
import Home from "./pages/Dashboard/home.page";

function App() {
  const [session, setSession] = useState(undefined);

  const auth = async () => {
    setSession(supabase.auth.session());
    await supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  };

  useEffect(() => {
    auth();
  }, []);

  return (
    <Switch>
      <Route
        exact
        path="/"
        render={
          !session
            ? () => <LandingPage />
            : localStorage.getItem("email") === undefined
            ? () => {
                window.location.href = "/home";
                return <Home />;
              }
            : () => <Auth session={session} />
        }
      />
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/auth" render={() => <Auth session={session} />} />
      <Route exact path="/home" component={Home} />
    </Switch>
  );
}

export default App;
