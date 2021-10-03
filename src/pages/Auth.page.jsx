import {
  Flex,
  Box,
  Image,
  Text,
  Input,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ArrowRight } from "react-feather";
import Logo from "../Assets/logo.svg";
import { supabase } from "../Helpers/supabase";

function Auth({ session }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      if (user) {
        console.log(user);
        setEmail(user.email);
        if (user.username) {
          setUsername(user?.username);
        }
        if (user.user_metadata) {
          setAvatarUrl(user.user_metadata?.avatar_url);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (username) => {
    if (username.length > 3) {
      try {
        setLoading(true);
        const user = supabase.auth.user();
        const updates = {
          id: user.id,
          username,
          avatar_url: avatarUrl,
          email: email,
        };

        const { error } = await supabase.from("users").upsert(updates, {
          returning: "minimal",
        });

        if (error) {
          throw error;
        }
        window.localStorage.setItem("email", email);
        window.location.href = "/home";
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
    } else {
      toast({
        title: "Error",
        position: "bottom",
        description: "Your name should have than 3 characters",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
        display={{ base: "none", md: "flex" }}
        w={{ md: "35%" }}
        h="100vh"
        bg="black.400"
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
            Let's know more about you
          </Text>
          <Text color="white" fontWeight="medium" mt="8" fontSize="sm">
            What do we call you?
          </Text>
          <Input
            value={username}
            type="text"
            onChange={(e) => {
              setUsername(e.target.value);
              console.log(username);
            }}
            mt="1.5"
            py="5"
            rounded="lg"
            color="white"
            _hover={{ borderColor: "whiteAlpha.900" }}
            _focus={{ borderColor: "brand.primary" }}
            borderColor="whiteAlpha.400"
            _placeholder={{ color: "whiteAlpha.400" }}
            placeholder="Your name"
          />
          <Button
            float="right"
            mt="6"
            rounded="lg"
            _focus={{}}
            _active={{}}
            rightIcon={<ArrowRight size="20px" />}
            onClick={() => updateUser(username)}
          >
            {loading ? <Spinner /> : <>Continue</>}
          </Button>
        </Box>
      </Box>
    </Flex>
  );
}

export default Auth;
