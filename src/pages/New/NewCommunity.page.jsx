import {
  Flex,
  Box,
  Divider,
  Text,
  Image,
  Input,
  Button,
  Textarea,
  useToast,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import StarterTemplate from "../../components/Misc/StarterTemplace.component";
import { User } from "../../Providers/User.provider";
import { ArrowLeft, CheckCircle, Edit } from "react-feather";
import { supabase } from "../../Helpers/supabase";

function NewCommunity() {
  const Logos = [
    "https://ik.imagekit.io/86h5mrsjotwk/defaultCommunityLogo_gUich_dto.svg?updatedAt=1633160835413",
    "https://ik.imagekit.io/86h5mrsjotwk/dc-3_PXKqFbob4Lj.svg?updatedAt=1633165287477",
    "https://ik.imagekit.io/86h5mrsjotwk/dc-2_7d7-btPTg.svg?updatedAt=1633165286592",
    "https://ik.imagekit.io/86h5mrsjotwk/dc-1_JT81iTWJQGq.svg?updatedAt=1633165286130",
  ];

  const { user } = User();
  const [logo, setLogo] = useState(Logos[0]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const LogoModal = () => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="brand.secondary" color="white">
          <ModalHeader>Choose a logo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex wrap="wrap">
              {Logos.map((data, key) => (
                <Image
                  border="4px"
                  cursor="pointer"
                  onClick={() => setLogo(data)}
                  borderColor={logo === data ? "brand.primary" : "transparent"}
                  mb="3"
                  mr="3"
                  src={data}
                  w="24"
                  h="24"
                  rounded="xl"
                />
              ))}
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const createCommunity = async (name, description, logo) => {
    if (name.length > 3) {
      setLogo(logo);
      try {
        setLoading(true);
        const updates = {
          name,
          description,
          logo,
          createdBy: [user?.email],
        };

        const { error } = await supabase.from("communities").upsert(updates, {
          returning: "minimal",
        });

        if (error) {
          throw error;
        }

        toast({
          title: "Success",
          position: "bottom",
          description: "Community created successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setTimeout(() => {
          window.location.href = "/home";
        }, 1000);
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
        description: "Name should have more than 3 characters",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <StarterTemplate>
      <LogoModal />
      <Box maxW="1200px">
        <Flex alignItems="center" experimental_spaceX="4">
          <Box
            cursor="pointer"
            p="2"
            onClick={() => {
              window.location.href = "/home";
            }}
            rounded="full"
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <ArrowLeft />
          </Box>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
            Create Community
          </Text>
        </Flex>
        <Divider mt="3" color="white" opacity="0.2" />
        <Flex
          mt="6"
          w={{ base: "full", md: "80%" }}
          direction={{ base: "column", md: "row" }}
        >
          <Box minW="24" mr="6" mb="4">
            <Text color="white" fontWeight="medium" fontSize="sm" mb="1">
              Logo
            </Text>
            <Box position="relative" w="-webkit-fit-content">
              <Box
                position="absolute"
                bg="blackAlpha.500"
                p="2"
                cursor="pointer"
                _hover={{ bg: "blackAlpha.600" }}
                transitionDuration="200ms"
                roundedTopStart="xl"
                bottom="0"
                right="0"
                onClick={onOpen}
              >
                <Edit size="18px" />
              </Box>
              <Image src={logo} w="24" h="24" rounded="lg" />
            </Box>
          </Box>
          <Box w="full">
            <Text color="white" fontWeight="medium" fontSize="sm">
              Name *
            </Text>
            <Input
              w={{ base: "full", md: "80%", lg: "70%" }}
              type="text"
              mt="1.5"
              py="5"
              rounded="lg"
              color="white"
              _hover={{ borderColor: "whiteAlpha.900" }}
              _focus={{ borderColor: "brand.primary" }}
              borderColor="whiteAlpha.400"
              _placeholder={{ color: "whiteAlpha.400" }}
              placeholder="Community name"
              onChange={(e) => setName(e.target.value)}
            />
            <Text color="white" mt="4" fontWeight="medium" fontSize="sm">
              Description
            </Text>
            <Textarea
              w={{ base: "full", md: "80%", lg: "70%" }}
              type="email"
              mt="1.5"
              p="4"
              rounded="lg"
              color="white"
              _hover={{ borderColor: "whiteAlpha.900" }}
              _focus={{ borderColor: "brand.primary" }}
              borderColor="whiteAlpha.400"
              _placeholder={{ color: "whiteAlpha.400" }}
              placeholder="Describe your community"
              onChange={(e) => setDescription(e.target.value)}
            />
            <Flex
              mt="6"
              justify="end"
              w={{ base: "full", md: "80%", lg: "70%" }}
            >
              <Button
                display="flex"
                float="right"
                rounded="lg"
                w={loading ? "200px" : "auto"}
                _focus={{}}
                _active={{}}
                color="black"
                onClick={() => createCommunity(name, description, logo)}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <CheckCircle /> <Text ml="2">Create Community</Text>
                  </>
                )}
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </StarterTemplate>
  );
}

export default NewCommunity;
