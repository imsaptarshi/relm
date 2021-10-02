import { useEffect, useState } from "react";
import Logo from "../../Assets/logo.svg";
import { Box, Flex, Text, Image, Divider, Button } from "@chakra-ui/react";
import { supabase } from "../../Helpers/supabase";
import Sidebar from "../../components/Navigation/Sidebar.component";
import { User } from "../../Providers/User.provider";
import { Menu, Plus, X } from "react-feather";
import DefaultCommunityLogo from "../../Assets/defaultCommunityLogo.svg";
import CommunityCard from "../../components/Cards/CommunityCard.component";
import StarterTemplate from "../../components/Misc/StarterTemplace.component";
import { Link } from "react-router-dom";

function Home() {
  const { user, setUser } = User();
  const [sidebarVisibility, setSidebarVisibility] = useState(false);
  const [communitities, setCommunities] = useState(undefined);

  useEffect(() => {
    getUser();
    getCommunities();
  }, []);

  const getCommunities = async () => {
    try {
      console.log(localStorage.getItem("email"));
      const { data, error } = await supabase
        .from("communities")
        .select("id, name, logo,description,audience,events")
        .contains("createdBy", [localStorage.getItem("email")]);

      if (error) {
        throw error;
      }

      setCommunities(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      console.log(localStorage.getItem("email"));
      const { data, error } = await supabase
        .from("users")
        .select("username, avatar_url, email")
        .eq("email", localStorage.getItem("email"))
        .single();

      if (error) {
        throw error;
      }

      setUser(data);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username,
          avatar_url: data.avatar_url,
          email: data.email,
        })
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StarterTemplate>
      <Box maxW="1200px">
        <Text color="whiteAlpha.500" fontSize={{ base: "sm", md: "lg" }}>
          Good Morning,
        </Text>
        <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
          {user?.username}
        </Text>
        <Divider mt="3" color="white" opacity="0.2" />
        <Flex justify="space-between" mt="4" alignItems="center">
          <Text
            casing="capitalize"
            fontSize="sm"
            fontWeight="semibold"
            letterSpacing="2px"
            color="white"
          >
            COMMUNITIES
          </Text>
          <Link to="/new/community">
            <Button
              size="sm"
              bg="alpha.white"
              border="1px"
              borderColor="transparent"
              leftIcon={<Plus size="18px" />}
              px="4"
              _hover={{ borderColor: "whiteAlpha.200", bg: "whiteAlpha.100" }}
              _focus={{}}
              _active={{ bg: "whiteAlpha.200" }}
            >
              Create
            </Button>
          </Link>
        </Flex>
        <Flex mt="4" wrap="wrap">
          {communitities?.map((data, key) => (
            <CommunityCard key={key} {...data} />
          ))}
        </Flex>
      </Box>
    </StarterTemplate>
  );
}

export default Home;
