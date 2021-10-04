import {
  Flex,
  Box,
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
import { User } from "../../Providers/User.provider";
import { CheckCircle, Edit, Upload } from "react-feather";
import { supabase } from "../../Helpers/supabase";
import axios from "axios";

function UpdateCommunity({
  id,
  communityName,
  communityDescription,
  communityLogo,
  close,
}) {
  const Logos = [
    "https://ik.imagekit.io/86h5mrsjotwk/defaultCommunityLogo_gUich_dto.svg?updatedAt=1633160835413",
    "https://ik.imagekit.io/86h5mrsjotwk/dc-3_PXKqFbob4Lj.svg?updatedAt=1633165287477",
    "https://ik.imagekit.io/86h5mrsjotwk/dc-2_7d7-btPTg.svg?updatedAt=1633165286592",
    "https://ik.imagekit.io/86h5mrsjotwk/dc-1_JT81iTWJQGq.svg?updatedAt=1633165286130",
  ];

  const { user } = User();
  const [logo, setLogo] = useState(communityLogo);
  const [name, setName] = useState(communityName);
  const [description, setDescription] = useState(communityDescription);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const uploadLogo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "kolmmszz");
    try {
      setUploading(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/relmcloud/image/upload",
        formData
      );
      console.log(res);
      setLogo(res.data.url);
      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const LogoModal = () => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pb="3" bg="#1D2023" color="white">
          <ModalHeader>Choose a logo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex wrap="wrap">
              <Flex
                cursor="pointer"
                border="2px"
                justify="center"
                alignItems="center"
                _hover={{ borderColor: "whiteAlpha.50" }}
                borderColor="transparent"
                mb="3"
                mr="3"
                w="24"
                h="24"
                rounded="xl"
                bg="whiteAlpha.300"
                onClick={() => {
                  document.getElementById("file").click();
                }}
              >
                <Upload size="30px" />
              </Flex>
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
          <Input
            type="file"
            id="file"
            accept="image/*"
            display="none"
            onChange={(e) => uploadLogo(e.target.files[0])}
          />
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              {uploading ? <Spinner /> : <>Done</>}
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
          id,
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

        close();
        window.location.reload();
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
    <Flex
      mt="6"
      w="full"
      direction={{ base: "column", md: "row" }}
      color="white"
    >
      <LogoModal />
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
          value={name}
          w="full"
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
          value={description}
          w="full"
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
        <Flex mt="6" justify="end" w="full">
          <Button
            display="flex"
            float="right"
            rounded="lg"
            w={loading ? "100px" : "auto"}
            _focus={{}}
            _active={{}}
            color="black"
            onClick={() => createCommunity(name, description, logo)}
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <CheckCircle /> <Text ml="2">Save</Text>
              </>
            )}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}

export default UpdateCommunity;
