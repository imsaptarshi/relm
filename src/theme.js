import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      primary: "#FF4085",
      secondary: "#131517",
    },
    alpha: {
      white: "rgba(255, 255, 255, 0.1)",
    },
    pink: {
      600: "#DE316F",
      800: "#862F4E",
    },
    black: {
      400: "#212325",
    },
  },
  fonts: {
    brand: "Red Hat Display",
  },
});

export default theme;
