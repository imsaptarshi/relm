import { Box, Flex, Image, Text, Input, Button } from "@chakra-ui/react";
import Logo from "../../Assets/logo.svg";

function Footer() {
  return (
    <Flex justify="center">
      <Flex
        w="full"
        maxW="1200px"
        justify="space-between"
        bg="brand.secondary"
        direction={{ base: "column", md: "row" }}
        alignItems="center"
        color="white"
        py="8"
        px={{ base: "8", lg: "24" }}
      >
        <Flex
          cursor="pointer"
          onClick={() => (window.location.href = "/")}
          alignItems="center"
          experimental_spaceX="4"
        >
          <Image src={Logo} alt="relm" w="12" h="12" />
          <Box>
            <Text fontWeight="bold" fontSize="2xl">
              relm
            </Text>
            <Text fontWeight="thin" fontSize="xx-small">
              Activating your community
            </Text>
          </Box>
        </Flex>
        <Flex
          w={{ base: "80%", md: "auto" }}
          direction="column"
          mt={{ base: "8", md: "0" }}
        >
          <Text>
            Get updates about{" "}
            <Text display="inline" color="brand.primary">
              Relm
            </Text>
          </Text>
          <Input
            type="email"
            mt="1.5"
            size="sm"
            rounded="lg"
            color="white"
            _hover={{ borderColor: "whiteAlpha.900" }}
            _focus={{ borderColor: "brand.primary" }}
            borderColor="whiteAlpha.400"
            _placeholder={{ color: "whiteAlpha.400" }}
            placeholder="Your email"
          />
          <Button
            _hover={{}}
            _active={{ bg: "pink.600" }}
            _focus={{}}
            bg="brand.primary"
            color="white"
            size="sm"
            px="6"
            mt="1.5"
            fontSize="xs"
            mb={{ base: "4", md: "0" }}
          >
            Subscribe to our newsletter
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
export default Footer;
