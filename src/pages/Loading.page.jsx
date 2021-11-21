import { Box, Text, Flex, Spinner } from "@chakra-ui/react";
import React from "react";
import { Helmet } from "react-helmet";

function Loading() {
  return (
    <Flex justify="center" alignItems="center">
      <Helmet>
        <title>Waiting for Relm ...</title>
      </Helmet>
      <Box overflowX="clip" w="full" bg="brand.secondary">
        <Flex justify="center" w="full">
          <Flex
            alignItems="center"
            justify="center"
            maxW="1400px"
            minH="100vh"
            py="6"
            px={{ base: "8", lg: "24" }}
            w="full"
          >
            <Spinner color="brand.primary" />
            <Text color="white" ml="4">
              Powering up communities ...
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}

export default Loading;
