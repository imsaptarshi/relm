import "./App.css";
import LandingPage from "./pages/Landing.page";
import { Route, Switch } from "react-router-dom";
import SignIn from "./pages/SignIn.page";
import Auth from "./pages/Auth.page";
import { useEffect, useState } from "react";
import { supabase } from "./Helpers/supabase";
import Home from "./pages/Dashboard/Home.page";
import NewCommunity from "./pages/New/NewCommunity.page";
import ManageCommunity from "./pages/Manage/ManageCommunity.page";
import Events from "./pages/Dashboard/Events.page";
import NewEvent from "./pages/New/NewEvent.page";
import ManageEvent from "./pages/Manage/ManageEvent.page";
import Audience from "./pages/Dashboard/Audience.page";
import Event from "./pages/Event";

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
            : localStorage.getItem("email")
            ? () => {
                return <Home />;
              }
            : () => <Auth session={session} />
        }
      />
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/event/:id" component={Event} />
      <Route exact path="/auth" render={() => <Auth session={session} />} />
      {localStorage.getItem("email") ? (
        <>
          <Route exact path="/home" component={Home} />
          <Route exact path="/new/community" component={NewCommunity} />
          <Route
            exact
            path="/manage/community/:id"
            component={ManageCommunity}
          />
          <Route exact path="/manage/event/:id" component={ManageEvent} />
          <Route exact path="/events" component={Events} />
          <Route exact path="/new/event" component={NewEvent} />
          <Route
            exact
            path="/manage/community/:id/new/event"
            component={NewEvent}
          />
          <Route exact path="/manage/community/:id/events" component={Events} />
          <Route exact path="/audience" component={Audience} />
          <Route
            exact
            path="/manage/community/:id/audience"
            component={Audience}
          />
        </>
      ) : (
        <SignIn />
      )}
    </Switch>
  );
}

export default App;
