import { Box, Text, Flex, Button, Tag } from "@chakra-ui/react";
import Navigation from "../components/Navigation/Navigation.component";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <Flex bg="brand.secondary" justify="center" w="full">
      <Box
        minH="100vh"
        py="6"
        px={{ base: "8", lg: "24" }}
        maxW="1400px"
        w="full"
      >
        <Navigation />
        <Flex justify="center" alignItems="center" mt="24" direction="column">
          <Text
            color="brand.primary"
            fontWeight="black"
            fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
            align="center"
          >
            Activating Your Community
          </Text>
          <Text
            color="white"
            fontWeight="medium"
            fontSize={{ base: "xs", md: "sm", lg: "lg" }}
            mt="2"
            px={{ lg: "40", md: "40", xl: "80" }}
            align="center"
          >
            Foster meaningful relationships with events, newsletters, and
            community analytics with{" "}
            <Text cursor="pointer" display="inline" color="brand.primary">
              Relm
            </Text>
          </Text>
          <Link to="/signin">
            <Button
              _hover={{ transform: "translateY(-1.5px)" }}
              _active={{ bg: "pink.600" }}
              _focus={{}}
              bg="brand.primary"
              color="white"
              mt="10"
              rounded="2xl"
              fontWeight="bold"
              fontSize="lg"
              px="14"
              py="7"
            >
              Get Into Realm
              <Tag
                position="absolute"
                top="-2"
                right="-3"
                color="white"
                rounded="full"
                bg="pink.800"
                px="3"
                py="1"
              >
                beta
              </Tag>
            </Button>
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
}

export default LandingPage;
