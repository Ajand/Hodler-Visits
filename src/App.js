import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter } from 'react-router-dom'

import client from "./app/client";

import Routes from "./app/router";

const theme = createTheme({
  palette: {
    mode: "dark",
    // palette values for dark mode
    primary: {
      main: "#F2A52B",
    },

    // palette values for dark mode
    background: {
      default: "#121212",
      paper: "121212",
    },
    text: {
      primary: "#fff",
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.5)",
    },
  },
  typography: {
    fontFamily: "'Satoshi', 'IBM Plex Sans', sans-serif",
  },
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
        <Routes />

        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
