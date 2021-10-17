import {
  Box,
  Text,
  Flex,
  Button,
  Tag,
  Divider,
  Image,
  AspectRatio,
} from "@chakra-ui/react";
import Navigation from "../components/Navigation/Navigation.component";
import Footer from "../components/Footer/Footer.component";

function LandingPage() {
  return (
    <Flex bg="brand.secondary" justify="center">
      <Box overflowX="clip" maxW="1400px">
        <Flex justify="center" w="full">
          <Box minH="100vh" py="6" px={{ base: "8", lg: "24" }} w="full">
            <Navigation />
            <Flex
              justify="center"
              alignItems="center"
              mt="24"
              direction="column"
            >
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
                Making communities more engaging with events, community
                analytics and newsletters with{" "}
                <Text cursor="pointer" display="inline" color="brand.primary">
                  Relm
                </Text>
              </Text>

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
                onClick={() => (window.location.href = "/signin")}
              >
                Get Into Relm
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
            </Flex>
            <AspectRatio
              mt={{ base: "32", md: "20", lg: "6" }}
              mb={{ base: "24", md: "16", lg: "0" }}
              mx="auto"
              transform={{ base: "scale(1.99)", md: "scale(1.2)", lg: "none" }}
              ratio={799 / 413}
            >
              <Image src="https://i.ibb.co/1dhvDZ7/hero.png" />
            </AspectRatio>
          </Box>
        </Flex>
        <Divider opacity="0.1" />
        <Footer />
      </Box>
    </Flex>
  );
}

export default LandingPage;
