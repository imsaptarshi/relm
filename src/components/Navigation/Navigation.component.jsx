/* eslint-disable react-hooks/exhaustive-deps */
import Logo from "../../Assets/logo.svg";
import { Image, Flex, Button, Text, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ArrowRight, User } from "react-feather";
import { useEffect, useState } from "react";
import { supabase } from "../../Helpers/supabase";

function Navigation({ communityId }) {
  const [user, setUser] = useState(undefined);
  const [community, setCommunity] = useState(undefined);

  useEffect(() => {
    if (window.localStorage.getItem("email")) {
      getUser();
    }
    if (communityId) {
      getCommunity();
    }
  }, [communityId]);

  const getUser = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username, avatar_url, email")
        .eq("email", window.localStorage.getItem("email"))
        .single();

      if (error) {
        throw error;
      }

      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCommunity = async () => {
    try {
      const { data, error } = await supabase
        .from("communities")
        .select("name, logo")
        .eq("id", communityId)
        .single();

      if (error) {
        throw error;
      }

      setCommunity(data);
    } catch (error) {
      console.log(error);
    }
  };

  const SignInButton = () => (
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
  );

  return (
    <Flex w="full" justify="space-between" alignItems="center">
      <Flex
        experimental_spaceX={community ? "2" : "3"}
        onClick={() => {
          if (!community) {
            window.location.href = "/";
          }
        }}
        alignItems="center"
        color="white"
        _hover={{ color: "brand.primary" }}
        cursor="pointer"
        transitionDuration="300ms"
      >
        <Image
          rounded={community ? "lg" : "none"}
          src={community ? community?.logo : Logo}
          alt="relm"
          w={community ? "7" : "8"}
          h={community ? "7" : "8"}
        />
        <Text fontWeight="bold" fontSize={community ? "base" : "24"}>
          {community ? <>{community?.name}</> : <>relm</>}
        </Text>
      </Flex>
      {window.localStorage.getItem("email") ? (
        <Link to="/home">
          <Button
            bg="alpha.white"
            color="white"
            px="6"
            size="sm"
            fontSize="xs"
            fontWeight="semibold"
            border="1px"
            borderColor="transparent"
            transitionDuration="200ms"
            _hover={{
              bg: "rgba(255, 255, 255, 0.05)",
              borderColor: "whiteAlpha.200",
            }}
            _focus={{}}
            leftIcon={<User size="14px" />}
            _active={{ bg: "rgba(255, 255, 255, 0.12)" }}
            whiteSpace="nowrap"
          >
            <Text isTruncated overflow="clip" maxW="80px">
              {user?.username}
            </Text>
          </Button>
        </Link>
      ) : (
        <SignInButton />
      )}
    </Flex>
  );
}

export default Navigation;
