import {
  Box,
  Flex,
  Image,
  Text,
  Input,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import Logo from "../../Assets/logo.svg";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import { useState } from "react";

function Footer() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState("");

  const subscribeUser = async (subscriber) => {
    if (subscribed !== email) {
      try {
        setLoading(true);
        subscriber({ EMAIL: email });
        setTimeout(() => {
          toast({
            title: "Success",
            position: "top-right",
            description: "Thank you for subscribing to Relm 😄",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setSubscribed(email);
          setEmail("");
        }, 1500);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    } else {
      toast({
        position: "top-right",
        description: "You are already subscribed",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <MailchimpSubscribe
      url={process.env.REACT_APP_MAILCHIMP_URL}
      render={(props) => {
        const { subscribe } = props || {};
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              subscribeUser(subscribe);
            }}
          >
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
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
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
                    type="submit"
                    _hover={{}}
                    _active={{ bg: "pink.600" }}
                    _focus={{}}
                    bg="brand.primary"
                    color="white"
                    size="sm"
                    px="6"
                    mt="2"
                    minW="200px"
                    fontSize="xs"
                    mb={{ base: "4", md: "0" }}
                  >
                    {loading ? (
                      <Spinner size="sm" />
                    ) : (
                      <>Subscribe to our newsletter</>
                    )}
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </form>
        );
      }}
    />
  );
}
export default Footer;
