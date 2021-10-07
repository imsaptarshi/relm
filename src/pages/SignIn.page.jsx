import {
  Flex,
  Box,
  Image,
  Text,
  Input,
  Button,
  Divider,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import Logo from "../Assets/logo.svg";
import { Check } from "react-feather";
import { useState } from "react";
import { supabase } from "../Helpers/supabase";
import Google from "../Assets/google.png";

function SignIn() {
  const [loading, setLoading] = useState(false);
  const [buttonMessage, setButtonMessage] = useState(<Text>Continue</Text>);
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleLoginWithGoogle = async (email) => {
    try {
      const { error } = await supabase.auth.signIn({
        provider: "google",
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      toast({
        title: "Error",
        position: "bottom",
        description: error.error_description || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      console.log("finally");
    }
  };

  const handleLogin = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });

      if (error) {
        throw error;
      }
      toast({
        title: "Account Created",
        position: "bottom",
        description: "Check your email for login link",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setButtonMessage(<Check />);
    } catch (error) {
      toast({
        title: "Error",
        position: "bottom",
        description: error.error_description || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex direction={{ base: "column", md: "row" }}>
      <Box
        bg="brand.secondary"
        pt="10"
        pl="10"
        display={{ base: "block", md: "none" }}
      >
        <Image src={Logo} alt="relm" w="12" h="12" />
      </Box>
      <Flex
        bg="black.400"
        display={{ base: "none", md: "flex" }}
        w={{ md: "35%" }}
        h="100vh"
        p={{ base: "6", md: "10" }}
        direction="column"
        justify="space-between"
      >
        <Image src={Logo} alt="relm" w="14" h="14" />
        <Box color="white">
          <Text fontWeight="bold" fontSize="4xl">
            relm
          </Text>
          <Text fontWeight="thin" fontSize="sm">
            Activating your community
          </Text>
        </Box>
      </Flex>
      <Box
        w={{ base: "100%", md: "65%" }}
        h="100vh"
        bg="brand.secondary"
        p={{ base: "10", md: "20" }}
      >
        <Box w={{ base: "100%", lg: "400px" }}>
          <Text color="white" fontWeight="bold" fontSize="3xl">
            Sign In
          </Text>
          <Text color="white" fontWeight="medium" mt="8" fontSize="sm">
            Sign in with your email
          </Text>
          <Input
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            mt="1.5"
            py="5"
            rounded="lg"
            color="white"
            _hover={{ borderColor: "whiteAlpha.900" }}
            _focus={{ borderColor: "brand.primary" }}
            borderColor="whiteAlpha.400"
            _placeholder={{ color: "whiteAlpha.400" }}
            placeholder="Your email"
          />
          <Button
            w="full"
            mt="3"
            rounded="lg"
            _focus={{}}
            _active={{}}
            onClick={() => handleLogin(email)}
          >
            {loading ? <Spinner /> : buttonMessage}
          </Button>
          <Flex alignItems="center" mt="14" mb="4" experimental_spaceX="3">
            <Text color="white" fontSize="xs" fontWeight="medium">
              OR
            </Text>
            <Divider w="full" color="white" />
          </Flex>
          <Button
            leftIcon={<Image src={Google} w="16px" h="16px" />}
            border="1px"
            borderColor="transparent"
            _hover={{ borderColor: "whiteAlpha.200" }}
            _focus={{}}
            _active={{}}
            w="full"
            bg="whiteAlpha.200"
            rounded="lg"
            fontSize="sm"
            color="white"
            onClick={() => handleLoginWithGoogle()}
          >
            Sign In With Google
          </Button>
          <Text color="whiteAlpha.500" mt="4" fontSize="sm">
            By signing in you agree to our terms and conditions
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}

export default SignIn;
