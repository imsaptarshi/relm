/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  Button,
  useToast,
  Checkbox,
  Spinner,
} from "@chakra-ui/react";
import { Check, Settings } from "react-feather";
import { useEffect, useState } from "react";
import { supabase } from "../../Helpers/supabase";
import { Calendar, Clipboard, Plus, ArrowLeft } from "react-feather";
import AudienceList from "../../components/Misc/AudienceList.component";
import HostCard from "../../components/Cards/HostCard.component";
import { useHistory } from "react-router";
import UpdateEvent from "../Update/UpdateEvent.page";
import { formatDate } from "../../Helpers/dateFormatter";
import { Helmet } from "react-helmet";

function ManageEvent(props) {
  const id = props.match.params.id;
  const [event, setEvent] = useState(undefined);
  const [audience, setAudience] = useState(undefined);
  const [createdBy, setCreatedBy] = useState([]);
  const { hasCopied, onCopy } = useClipboard(
    `${window.location.origin}/event/${id}`
  );
  const history = useHistory();
  const toast = useToast();
  const [isListed, setIsListed] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [newChanges, setNewChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    getEvent();
    getAudience();
  }, []);

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

  const getEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(
          "id, name, image, link, description, content, date, community, audience, createdBy, admin, isListed, isOpen,platform"
        )
        .contains("createdBy", [localStorage.getItem("email")])
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      setEvent(data);
      setIsListed(data.isListed);
      setRegistrationOpen(data.isOpen);
      setCreatedBy(data.createdBy);
    } catch (error) {
      console.log(error);
    }
  };

  const updateEvent = async () => {
    try {
      setLoading(true);
      let updates = {};
      updates = {
        id,
        isOpen: registrationOpen,
        isListed,
      };
      console.log(isListed, registrationOpen);
      console.log(updates);

      const { error } = await supabase.from("events").upsert(updates, {
        returning: "minimal",
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setNewChanges(false);
    }
  };

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const AddHost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const AddHostModal = () => {
      return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent pb="3" bg="#1D2023" color="white">
            <ModalHeader>Add host</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                id="email"
                type="email"
                _placeholder={{ color: "whiteAlpha.500" }}
                placeholder="Email"
                _focus={{ borderColor: "brand.primary" }}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                bg="brand.primary"
                _hover={{}}
                _active={{}}
                onClick={async () => {
                  if (validateEmail(document.getElementById("email").value)) {
                    createdBy.push(document.getElementById("email").value);

                    try {
                      const { error } = await supabase
                        .from("events")
                        .upsert({ id, createdBy }, { returning: "minimal" });

                      if (error) {
                        throw error;
                      }
                    } catch (error) {
                      console.log(error);
                    }
                    onClose();
                    window.location.reload();
                  } else {
                    toast({
                      title: "Error",
                      position: "bottom",
                      description: "Enter a valid email address",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                  }
                }}
              >
                Add
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
    };

    return (
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
        onClick={onOpen}
        minH="14"
        experimental_spaceX="4"
        maxW={{ base: "full", md: "280px" }}
      >
        <AddHostModal />
        <Plus />
      </Flex>
    );
  };

  const UpdateEventModal = () => {
    return (
      <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#1D2023">
          <ModalHeader color="white">
            Settings <ModalCloseButton color="white" />
          </ModalHeader>

          <ModalBody px="8" pb="8">
            <UpdateEvent
              eventId={id}
              eventName={event?.name}
              eventContent={event?.content}
              eventDate={event?.date}
              eventDescription={event?.description}
              eventPlatform={event?.platform}
              eventImage={event?.image}
              eventLink={event?.link}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  const CopyInput = () => {
    return (
      <InputGroup>
        <Input
          cursor="pointer"
          transitionDuration="200ms"
          onClick={() => {
            window.open(`${window.location.origin}/event/${id}`, "_blank");
          }}
          _hover={{ color: "brand.primary" }}
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
      {event ? (
        <Helmet>
          <title>{event?.name} | Relm</title>
        </Helmet>
      ) : (
        <></>
      )}
      <Box>
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
              <Text>{formatDate(event?.date)}</Text>
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
              onClick={onOpen}
            >
              <UpdateEventModal />
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
          <HostCard id={id} admin={event?.admin} email={data} key={key} />
        ))}
        {window.localStorage.getItem("email") === event?.admin ? (
          <AddHost />
        ) : (
          <></>
        )}
      </Flex>
      <Flex direction="column" mt="4">
        <Checkbox
          w="-webkit-fit-content"
          onChange={(e) => {
            setIsListed(e.target.checked);
            setNewChanges(true);
          }}
          isChecked={isListed}
        >
          Listed publicly
        </Checkbox>
        <Checkbox
          w="-webkit-fit-content"
          onChange={(e) => {
            setRegistrationOpen(e.target.checked);
            setNewChanges(true);
          }}
          isChecked={registrationOpen}
        >
          Registrations open
        </Checkbox>
        <Box>
          <Button
            display={newChanges ? "block" : "none"}
            float="right"
            size="sm"
            mt="2"
            minW="28"
            onClick={() => {
              updateEvent();
            }}
            colorScheme="whiteAlpha"
          >
            {loading ? <Spinner size="sm" /> : <> Save changes</>}
          </Button>
        </Box>
      </Flex>
    </StarterTemplate>
  );
}

export default ManageEvent;
