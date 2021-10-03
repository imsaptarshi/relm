import StarterTemplate from "../../components/Misc/StarterTemplace.component";
import {
  Box,
  Flex,
  Text,
  Divider,
  Input,
  InputGroup,
  InputRightElement,
  useClipboard,
  Tooltip,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { Check, Settings } from "react-feather";
import { useEffect, useState } from "react";
import { supabase } from "../../Helpers/supabase";
import { Calendar, Clipboard, Plus, ArrowLeft } from "react-feather";
import AudienceList from "../../components/Misc/AudienceList.component";
import HostCard from "../../components/Cards/HostCard.component";
import { useHistory } from "react-router";

function ManageEvent(props) {
  const id = props.match.params.id;
  const [event, setEvent] = useState(undefined);
  const [audience, setAudience] = useState(undefined);
  const { hasCopied, onCopy } = useClipboard(
    `${window.location.origin}/event/${id}`
  );
  const history = useHistory();

  useEffect(() => {
    getEvents();
    getAudience();
  }, []);

  const Months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getAudience = async () => {
    try {
      const { data, error } = await supabase
        .from("audience")
        .select("name, email, events")
        .contains("events", [id]);

      if (error) {
        throw error;
      }

      setAudience(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(
          "id, name, image, description, date, community, audience, createdBy"
        )
        .contains("createdBy", [localStorage.getItem("email")])
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      setEvent(data);
    } catch (error) {
      console.log(error);
    }
  };

  const CopyInput = () => {
    return (
      <InputGroup>
        <Input
          value={`${window.location.origin}/event/${id}`}
          isReadOnly
          rounded="lg"
          border="none"
          bg="whiteAlpha.200"
        />

        <InputRightElement
          onClick={() => onCopy()}
          cursor="pointer"
          p="2"
          roundedRight="lg"
          transitionDuration="200ms"
          _hover={{ color: "brand.primary" }}
        >
          <Tooltip label="Copy to clipboard">
            {hasCopied ? <Check /> : <Clipboard size="20px" />}
          </Tooltip>
        </InputRightElement>
      </InputGroup>
    );
  };

  return (
    <StarterTemplate>
      <Box maxW="1200px">
        <Flex justify="space-between" alignItems="end">
          <Box>
            <Flex experimental_spaceX="3" alignItems="center">
              <Box
                cursor="pointer"
                p="2"
                w="10"
                h="10"
                onClick={() => {
                  history.goBack();
                }}
                rounded="full"
                _hover={{ bg: "whiteAlpha.200" }}
              >
                <ArrowLeft />
              </Box>
              <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
                {event?.name}
              </Text>
            </Flex>
            <Flex
              fontSize="xs"
              color="brand.primary"
              experimental_spaceX="1.5"
              alignItems="center"
              mt="1"
            >
              <Calendar size="14px" />
              <Text>
                {`${Months[event?.date.month - 1]} ${event?.date.date}, ${
                  event?.date.time
                } GMT+5:30`}
              </Text>
            </Flex>
            {event?.description ? (
              <Text
                mt="1"
                fontSize={{ base: "xs", md: "sm" }}
                fontWeight="thin"
              >
                {event?.description}
              </Text>
            ) : (
              <></>
            )}
          </Box>
          <Flex direction="column" alignItems="end" experimental_spaceY="1">
            <Box
              _hover={{ bg: "whiteAlpha.200" }}
              rounded="full"
              p="2"
              cursor="pointer"
            >
              <Settings size="20px" />
            </Box>
            <Box display={{ base: "none", md: "block" }}>
              <Text fontSize="xs" mb="1" color="whiteAlpha.500">
                Sharable invite link
              </Text>
              <CopyInput />
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Divider mt="3" color="white" opacity="0.2" />
      <Box display={{ base: "block", md: "none" }}>
        <Flex justify="space-between" mt="4" alignItems="center">
          <Text
            casing="capitalize"
            fontSize="sm"
            fontWeight="semibold"
            letterSpacing="2px"
            color="white"
          >
            INVITE LINK
          </Text>
        </Flex>
        <Box mt="2">
          <CopyInput />
        </Box>
      </Box>
      <Flex justify="space-between" mt="8" alignItems="center">
        <Text
          casing="capitalize"
          fontSize="sm"
          fontWeight="semibold"
          letterSpacing="2px"
          color="white"
        >
          GUESTS
        </Text>
      </Flex>
      <AudienceList audience={audience} />
      <Flex justify="space-between" mt="8" alignItems="center">
        <Text
          casing="capitalize"
          fontSize="sm"
          fontWeight="semibold"
          letterSpacing="2px"
          color="white"
        >
          HOST & MANAGERS
        </Text>
      </Flex>
      <Flex mt="4" wrap="wrap">
        {event?.createdBy.map((data, key) => (
          <HostCard email={data} key={key} />
        ))}
        <Flex
          border="2px"
          cursor="pointer"
          mr={{ md: "4" }}
          mb="4"
          borderColor="transparent"
          transitionDuration="200ms"
          _hover={{ borderColor: "whiteAlpha.200", bg: "whiteAlpha.100" }}
          overflow="clip"
          bg="whiteAlpha.50"
          p="2"
          justify="center"
          borderStyle="dashed"
          alignItems="center"
          rounded="xl"
          w="full"
          minH="14"
          experimental_spaceX="4"
          maxW={{ base: "full", md: "280px" }}
        >
          <Plus />
        </Flex>
      </Flex>
    </StarterTemplate>
  );
}

export default ManageEvent;
