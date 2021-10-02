import { Flex, AspectRatio, Image, Text } from "@chakra-ui/react";
import { Calendar, Users } from "react-feather";

function CommunityCard({ id, name, description, audience, events, logo }) {
  return (
    <Flex
      border="1px"
      cursor="pointer"
      mr={{ md: "0", lg: "4" }}
      mb="4"
      borderColor="transparent"
      transitionDuration="200ms"
      _hover={{ borderColor: "whiteAlpha.200", bg: "whiteAlpha.100" }}
      overflow="clip"
      alignItems="center"
      bg="alpha.white"
      p="2"
      rounded="xl"
      w="full"
      experimental_spaceX="4"
      maxW="400px"
    >
      <AspectRatio ratio={1} minW="20">
        <Image src={logo} rounded="lg" />
      </AspectRatio>
      <Flex direction="column" justify="space-between">
        <Text pr="2" fontWeight="semibold" fontSize={{ base: "lg", md: "xl" }}>
          {name}
        </Text>
        <Flex experimental_spaceX="2" alignItems="center">
          <Users size="16px" />
          <Text fontSize={{ base: "xs", md: "sm" }}>{audience}</Text>
        </Flex>
        <Flex experimental_spaceX="2" alignItems="center">
          <Calendar size="16px" />
          <Text fontSize={{ base: "xs", md: "sm" }}>{events}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default CommunityCard;