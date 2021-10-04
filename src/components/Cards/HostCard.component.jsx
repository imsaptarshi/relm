/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Avatar, Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "../../Helpers/supabase";

function HostCard({ email }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username, avatar_url, email")
        .eq("email", email)
        .single();

      if (error) {
        throw error;
      }

      setUser(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      border="1px"
      cursor="pointer"
      mr={{ md: "4" }}
      mb="4"
      borderColor="transparent"
      transitionDuration="200ms"
      _hover={{ borderColor: "whiteAlpha.200", bg: "whiteAlpha.100" }}
      overflow="clip"
      bg="alpha.white"
      p="2"
      alignItems="center"
      rounded="xl"
      w="full"
      experimental_spaceX="4"
      maxW={{ base: "full", md: "280px" }}
    >
      <Avatar size="md" src={user?.avatar_url} name={user?.username || email} />
      <Box>
        <Text
          align="left"
          color="white"
          whiteSpace="nowrap"
          fontWeight="semibold"
          fontSize="lg"
        >
          {user?.username}
        </Text>
        <Text
          align="left"
          color="white"
          whiteSpace="nowrap"
          fontSize={user ? "xs" : "sm"}
        >
          {email}
        </Text>
      </Box>
    </Flex>
  );
}

export default HostCard;
