/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, AspectRatio, Image, Text, Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Calendar, Users } from "react-feather";
import { supabase } from "../../Helpers/supabase";

function EventCard({
  id,
  name,
  description,
  date,
  image,
  community,
  audience,
}) {
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
  const [communityData, setCommunityData] = useState(undefined);

  useEffect(() => {
    if (community) {
      getCommunity();
    }
  }, []);

  const getCommunity = async () => {
    try {
      const { data, error } = await supabase
        .from("communities")
        .select("id, name, logo")
        .contains("createdBy", [localStorage.getItem("email")])
        .eq("id", community)
        .single();

      if (error) {
        throw error;
      }

      setCommunityData(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      direction="column"
      border="1px"
      cursor="pointer"
      mr="4"
      mb="4"
      borderColor="transparent"
      transitionDuration="200ms"
      _hover={{ borderColor: "whiteAlpha.200", bg: "whiteAlpha.100" }}
      overflow="clip"
      bg="alpha.white"
      p="2"
      rounded="xl"
      w="full"
      experimental_spaceX="4"
      maxW={{ base: "full", md: "300px" }}
    >
      <AspectRatio ratio={1920 / 1080} w="full">
        <Image src={image} alt={name} rounded="lg" />
      </AspectRatio>
      <Flex direction="column" justify="space-between" h="full">
        <Box>
          <Text fontSize="xl" fontWeight="bold" mt="4">
            {name}
          </Text>
          <Flex
            fontSize="xs"
            color="brand.primary"
            experimental_spaceX="1.5"
            alignItems="center"
            mt="1"
          >
            <Calendar size="14px" />
            <Text>
              {`${Months[date.month - 1]} ${date.date}, ${date.time} GMT+5:30`}
            </Text>
          </Flex>
          <Flex
            mt="1"
            fontSize="xs"
            experimental_spaceX="1.5"
            color="white"
            alignItems="center"
          >
            <Users size="14px" />
            <Text>{audience}</Text>
          </Flex>
          <Text mt="4">{description}</Text>
        </Box>
        <Box>
          <Flex mt="4" mb="2" justify="space-between" mr="2">
            {communityData ? (
              <Flex alignItems="center" experimental_spaceX="2">
                <Image
                  src={communityData.logo}
                  alt={communityData.name}
                  w="5"
                  h="5"
                  rounded="base"
                />
                <Text fontWeight="medium" fontSize="sm">
                  {communityData.name}
                </Text>
              </Flex>
            ) : (
              <Box></Box>
            )}
            <Button
              size="sm"
              bg="alpha.white"
              border="1px"
              borderColor="transparent"
              px="4"
              _hover={{ borderColor: "whiteAlpha.200", bg: "whiteAlpha.100" }}
              _focus={{}}
              _active={{ bg: "whiteAlpha.200" }}
            >
              Manage
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

export default EventCard;
