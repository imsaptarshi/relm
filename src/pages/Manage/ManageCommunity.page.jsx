/* eslint-disable react-hooks/exhaustive-deps */
import StarterTemplate from "../../components/Misc/StarterTemplace.component";
import {
  Flex,
  Box,
  Text,
  Divider,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  ModalBody,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Settings, Plus } from "react-feather";
import { useEffect, useState } from "react";
import { supabase } from "../../Helpers/supabase";
import { User } from "../../Providers/User.provider";
import { isUpcoming } from "../../Helpers/isUpcoming";
import EventCard from "../../components/Cards/EventCard.component";
import UpdateCommunity from "../Update/UpdateCommunity.page";
import CurrentLocation from "../../components/Misc/CurrentLocation.component";
import { Helmet } from "react-helmet";

function ManageCommunity(props) {
  const id = props.match.params.id;
  const [community, setCommunity] = useState(undefined);
  const [upcomingEvents, setUpcomingEvents] = useState(undefined);
  const { user } = User();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getCommunity();
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("id, name, image, description, date, community, audience")
        .contains("createdBy", [localStorage.getItem("email")])
        .eq("community", id)
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

  const getCommunity = async () => {
    try {
      console.log(localStorage.getItem("email"));
      const { data, error } = await supabase
        .from("communities")
        .select("id, name, logo,description,audience,events")
        .contains("createdBy", [localStorage.getItem("email")])
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      setCommunity(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StarterTemplate communityId={id}>
      {community ? (
        <Helmet>
          <title>{community?.name} | Relm</title>
        </Helmet>
      ) : (
        <></>
      )}
      <Box>
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent bg="#1D2023">
            <ModalHeader color="white">
              Settings <ModalCloseButton color="white" />
            </ModalHeader>

            <ModalBody px="8" pb="8">
              <UpdateCommunity
                communityName={community?.name}
                communityDescription={community?.description}
                communityLogo={community?.logo}
                id={community?.id}
                close={onClose}
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        <CurrentLocation
          link="/home"
          username={user?.username}
          communityName={community?.name}
        />

        <Flex justify="space-between" alignItems="end">
          <Box>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
              {community?.name}
            </Text>
            {community?.description ? (
              <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="thin">
                {community?.description}
              </Text>
            ) : (
              <></>
            )}
          </Box>
          <Box
            _hover={{ bg: "whiteAlpha.200" }}
            rounded="full"
            p="2"
            cursor="pointer"
            onClick={() => onOpen()}
          >
            <Settings size="20px" />
          </Box>
        </Flex>
        <Divider mt="3" color="white" opacity="0.2" />
      </Box>
      {upcomingEvents ? (
        <>
          <Flex justify="space-between" mt="4" alignItems="center">
            <Link to={`/manage/community/${id}/events`}>
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
            <Link to={`/manage/community/${id}/new/event`}>
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

          {upcomingEvents?.length > 0 ? (
            upcomingEvents?.map((data, key) => (
              <Flex wrap="wrap" mt="4">
                <EventCard key={key} {...data} />
              </Flex>
            ))
          ) : upcomingEvents ? (
            <Flex
              color="whiteAlpha.600"
              my="10"
              justify="center"
              textAlign="center"
            >
              🐝 No upcoming events
            </Flex>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </StarterTemplate>
  );
}

export default ManageCommunity;
