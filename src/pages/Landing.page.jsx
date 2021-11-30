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
import Youtube from "react-youtube-embed";
import loadImage from "../Cache/imageLoader";
import React from "react";
import Loading from "./Loading.page";
import { Helmet } from "react-helmet";
import Hero from "../Assets/hero.png";

function LandingPage() {
  const SuspenseImage = (props) => {
    loadImage(props.src).read();
    return <Image {...props} />;
  };

  return (
    <React.Suspense fallback={<Loading />}>
      <Flex justify="center">
        <Helmet>
          <title>Relm - Activating your community</title>
        </Helmet>
        <Box overflowX="clip" w="full" bg="brand.secondary">
          <Flex justify="center" w="full">
            <Box
              maxW="1400px"
              minH="100vh"
              py="6"
              px={{ base: "8", lg: "24" }}
              w="full"
            >
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
                transform={{
                  base: "scale(1.99)",
                  md: "scale(1.2)",
                  lg: "none",
                }}
                ratio={799 / 413}
              >
                <SuspenseImage src={Hero} />
              </AspectRatio>
            </Box>
          </Flex>

          <Flex
            justify="center"
            py={{ base: "14", md: "16", lg: "20" }}
            bg="#17181A"
          >
            <Box maxW="1400px" w="full" px={{ base: "8", lg: "44" }}>
              <Youtube id="vYEdKI0BsXQ" />
            </Box>
          </Flex>
          <Divider opacity="0.1" />
          <Footer />
        </Box>
      </Flex>
    </React.Suspense>
  );
}

export default LandingPage;
