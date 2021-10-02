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
} from "@chakra-ui/react";
import { useState } from "react";
import StarterTemplate from "../../components/Misc/StarterTemplace.component";
import { User } from "../../Providers/User.provider";
import { CheckCircle } from "react-feather";
import { supabase } from "../../Helpers/supabase";

function NewCommunity() {
  const { user } = User();
  const [logo, setLogo] = useState(
    "https://ik.imagekit.io/86h5mrsjotwk/defaultCommunityLogo_gUich_dto.svg?updatedAt=1633160835413"
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

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
        description: "Name should have than 3 characters",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <StarterTemplate>
      <Box maxW="1200px">
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
          Create Community
        </Text>
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
            <Image
              src="https://ik.imagekit.io/86h5mrsjotwk/defaultCommunityLogo_gUich_dto.svg?updatedAt=1633160835413"
              w="24"
              h="24"
              rounded="lg"
            />
          </Box>
          <Box w="full">
            <Text color="white" fontWeight="medium" fontSize="sm">
              Name*
            </Text>
            <Input
              w={{ base: "full", md: "80%", lg: "70%" }}
              type="email"
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
