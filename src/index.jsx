import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./Providers/User.provider";
import { Provider as SupabaseProvider } from "react-supabase";
import { supabase } from "./Helpers/supabase";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <SupabaseProvider value={supabase}>
        <UserProvider>
          <ChakraProvider theme={theme}>
            <App />
          </ChakraProvider>
        </UserProvider>
      </SupabaseProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
