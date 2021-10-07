/* eslint-disable react-hooks/exhaustive-deps */
import {
  Flex,
  Avatar,
  Box,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "../../Helpers/supabase";

function HostCard({ id, admin, email }) {
  const [user, setUser] = useState(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    getUser();
  }, []);

  const removeHost = async (email) => {
    try {
      const { data } = await supabase
        .from("events")
        .select("id, createdBy")
        .eq("id", id)
        .single();
      const newCreatedBy = [];
      data?.createdBy.forEach((data) => {
        if (data !== email) {
          newCreatedBy.push(data);
        }
      });
      await supabase
        .from("events")
        .upsert(
          { id: data.id, createdBy: newCreatedBy },
          { returning: "minimal" }
        );

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const RemoveHostModal = () => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pb="3" bg="#1D2023" color="white">
          <ModalCloseButton />
          <ModalBody>
            <Flex
              transitionDuration="200ms"
              overflow="clip"
              p="2"
              alignItems="center"
              rounded="xl"
              w="full"
              experimental_spaceX="4"
              maxW={{ base: "full", md: "280px" }}
            >
              <Avatar
                size="md"
                src={user?.avatar_url}
                name={user?.username || email}
              />
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
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              bg="whiteAlpha.300"
              mr="2"
              _hover={{}}
              _active={{}}
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              size="sm"
              bg="red"
              _hover={{}}
              _active={{}}
              onClick={() => {
                if (email === window.localStorage.getItem("email")) {
                  toast({
                    title: "Error",
                    position: "bottom",
                    description: "Cannot remove admin from host",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                } else {
                  removeHost(email);
                }
              }}
            >
              Remove from host
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      onClick={() => {
        if (admin === window.localStorage.getItem("email")) {
          onOpen();
        }
      }}
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
      <RemoveHostModal />
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
