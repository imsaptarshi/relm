/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Text } from "@chakra-ui/react";
import "./InsightCard.styles.css";
import Showdown from "showdown";
import { useEffect, useState } from "react";
import { supabase } from "../../Helpers/supabase";

function InsightCard({ name, email, content, rating, event }) {
  const converter = new Showdown.Converter();
  const [eventData, setEvent] = useState(undefined);

  useEffect(() => {
    getEvent();
  }, []);

  const getEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("name")
        .eq("id", event)
        .single();

      if (error) {
        throw error;
      }
      setEvent(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      direction="column"
      border="1px"
      cursor="pointer"
      h="-webkit-fit-content"
      mr={{ md: "4" }}
      mb="4"
      borderColor="transparent"
      transitionDuration="200ms"
      _hover={{ borderColor: "whiteAlpha.200", bg: "whiteAlpha.100" }}
      overflow="clip"
      bg="alpha.white"
      py="4"
      px="6"
      rounded="xl"
      w="full"
      maxW={{ base: "full", md: "320px" }}
    >
      <Text
        align="left"
        color="white"
        whiteSpace="nowrap"
        fontWeight="semibold"
        fontSize="lg"
      >
        {name}
      </Text>
      <Text align="left" color="white" whiteSpace="nowrap" fontSize="xs">
        {email}
      </Text>
      <Text
        id="content"
        fontSize="base"
        mt="2"
        fontWeight="thin"
        dangerouslySetInnerHTML={{
          __html: converter.makeHtml(content),
        }}
      ></Text>
      <Text fontSize="2xl" mt="-2">
        {rating}
      </Text>
      <Text
        align="left"
        color="white"
        mt="2"
        whiteSpace="nowrap"
        fontWeight="semibold"
        fontSize="sm"
      >
        {eventData?.name}
      </Text>
    </Flex>
  );
}

export default InsightCard;
