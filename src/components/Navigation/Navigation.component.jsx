import Logo from "../../Assets/logo.svg";
import { Image, Flex, Button, Text, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ArrowRight } from "react-feather";

function Navigation() {
  return (
    <Flex w="full" justify="space-between" alignItems="center">
      <Flex
        experimental_spaceX="3"
        alignItems="center"
        color="white"
        _hover={{ color: "brand.primary" }}
        cursor="pointer"
        transitionDuration="300ms"
      >
        <Image src={Logo} alt="relm" w="8" h="8" />
        <Text fontWeight="bold" fontSize="24">
          relm
        </Text>
      </Flex>
      <Link to="/signin">
        <Button
          bg="alpha.white"
          color="white"
          px="6"
          size="sm"
          fontSize="xs"
          fontWeight="bold"
          border="1px"
          borderColor="transparent"
          transitionDuration="200ms"
          _hover={{
            bg: "rgba(255, 255, 255, 0.05)",
            borderColor: "whiteAlpha.200",
          }}
          _focus={{}}
          _active={{ bg: "rgba(255, 255, 255, 0.12)" }}
        >
          Sign in
          <Box ml="1">
            <ArrowRight size="14px" />
          </Box>
        </Button>
      </Link>
    </Flex>
  );
}

export default Navigation;
