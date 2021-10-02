/* eslint-disable react-hooks/exhaustive-deps */
import StarterTemplate from "../../components/Misc/StarterTemplace.component";
import {
  Box,
  Divider,
  Text,
  Flex,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Plus, ArrowLeft } from "react-feather";
import { User } from "../../Providers/User.provider";
import { supabase } from "../../Helpers/supabase";
import EventCard from "../../components/Cards/EventCard.component";
import { isUpcoming } from "../../Helpers/isUpcoming";

function Events(props) {
  const id = props.match.params.id;
  const [active, setActive] = useState("Upcoming");
  const [upcomingEvents, setUpcomingEvents] = useState(undefined);
  const [doneEvents, setDoneEvents] = useState(undefined);
  const NavigationItems = ["Upcoming", "Done"];
  const { user } = User();

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      if (id) {
        const { data, error } = await supabase
          .from("events")
          .select("id, name, image,description,date,community,audience")
          .contains("createdBy", [localStorage.getItem("email")])
          .eq("community", id);

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
        setDoneEvents(dE);
        setUpcomingEvents(uE);
      } else {
        const { data, error } = await supabase
          .from("events")
          .select("id, name, image,description,date,community,audience")
          .contains("createdBy", [localStorage.getItem("email")]);

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
        setDoneEvents(dE);
        setUpcomingEvents(uE);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Navigation = ({ name }) => {
    return (
      <Box
        py="2"
        px="4"
        borderBottom="2px"
        onClick={() => setActive(name)}
        transitionDuration="200ms"
        cursor="pointer"
        color={active === name ? "brand.primary" : "whiteAlpha.700"}
        _hover={{ color: active === name ? "brand.primary" : "white" }}
        borderColor={active === name ? "brand.primary" : "transparent"}
      >
        <Text>{name}</Text>
      </Box>
    );
  };

  return (
    <StarterTemplate communityId={id}>
      <Box maxW="1200px">
        {id ? (
          <Flex alignItems="center" experimental_spaceX="2">
            <Box
              cursor="pointer"
              onClick={() => {
                if (id) {
                  window.location.href = "/manage/community/" + id;
                } else {
                  window.location.href = "/home";
                }
              }}
            >
              <ArrowLeft size="18px" />
            </Box>
            <Breadcrumb color="white">
              <BreadcrumbItem>
                <BreadcrumbLink href="/home">{user?.username}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Orbits</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Flex>
        ) : (
          <></>
        )}
        <Flex alignItems="center" justify="space-between">
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
            Events
          </Text>
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
            onClick={() => {
              const to = id
                ? `/manage/community/${id}/new/event`
                : "/new/event";
              window.location.href = to;
            }}
          >
            Create
          </Button>
        </Flex>
        <Flex mt="3" experimental_spaceX="3">
          {NavigationItems.map((data, key) => (
            <Navigation name={data} />
          ))}
        </Flex>
        <Divider color="white" opacity="0.2" />
      </Box>
      <Flex wrap="wrap" mt="6">
        {active === "Upcoming" ? (
          upcomingEvents?.map((data, key) => <EventCard key={key} {...data} />)
        ) : (
          <></>
        )}
        {active === "Done" ? (
          doneEvents?.map((data, key) => <EventCard key={key} {...data} />)
        ) : (
          <></>
        )}
      </Flex>
    </StarterTemplate>
  );
}

export default Events;
