/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Box, Flex, Text, Divider, Button } from "@chakra-ui/react";
import { supabase } from "../../Helpers/supabase";
import { User } from "../../Providers/User.provider";
import { Plus } from "react-feather";
import CommunityCard from "../../components/Cards/CommunityCard.component";
import StarterTemplate from "../../components/Misc/StarterTemplace.component";
import { Link } from "react-router-dom";
import EventCard from "../../components/Cards/EventCard.component";
import { isUpcoming } from "../../Helpers/isUpcoming";
import { wish } from "../../Helpers/wisher";

function Home() {
  const { user, setUser } = User();
  const [communitities, setCommunities] = useState(undefined);
  const [upcomingEvents, setUpcomingEvents] = useState(undefined);

  useEffect(() => {
    getUser();
    getCommunities();
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("id, name, image, description, date, community, audience")
        .contains("createdBy", [localStorage.getItem("email")])
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      let uE = [];
      let dE = [];
      data.forEach((data) => {
        if (isUpcoming(data.date)) {
          uE.push(data);
        } else {
          dE.push(data);
        }
      });

      setUpcomingEvents(uE);
    } catch (error) {
      console.log(error);
    }
  };

  const UpcomingEvents = () => {
    return (
      <>
        <Flex justify="space-between" mt="6" alignItems="center">
          <Link to="/events">
            <Text
              casing="capitalize"
              fontSize="sm"
              fontWeight="semibold"
              letterSpacing="2px"
              color="white"
            >
              UPCOMING EVENTS
            </Text>
          </Link>
          <Link to={`/new/event`}>
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
        <Flex wrap="wrap" mt="4">
          {upcomingEvents ? (
            upcomingEvents?.map((data, key) => (
              <EventCard key={key} {...data} />
            ))
          ) : (
            <></>
          )}
        </Flex>
      </>
    );
  };

  const getCommunities = async () => {
    try {
      console.log(localStorage.getItem("email"));
      const { data, error } = await supabase
        .from("communities")
        .select("id, name, logo,description,audience,events")
        .contains("createdBy", [localStorage.getItem("email")])
        .order("created_at", { ascending: false });

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
      <Box>
        <Text color="whiteAlpha.500" fontSize={{ base: "sm", md: "lg" }}>
          {wish()},
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
        {upcomingEvents?.length > 0 ? <UpcomingEvents /> : <></>}
      </Box>
    </StarterTemplate>
  );
}

export default Home;
