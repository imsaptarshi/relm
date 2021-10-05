/* eslint-disable react-hooks/exhaustive-deps */
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
  AspectRatio,
} from "@chakra-ui/react";
import { useState } from "react";
import { Calendar, CheckCircle, MapPin } from "react-feather";
import { supabase } from "../../Helpers/supabase";
import moment from "moment";
import axios from "axios";

function UpdateEvent({
  eventId,
  eventName,
  eventDescription,
  eventImage,
  eventPlatform,
  eventLink,
  eventDate,
  eventContent,
}) {
  const Platforms = [
    {
      name: "💻 Virtual",
      enum: "Virtual",
      placeholder: "Link to event",
    },
    {
      name: "🌍 In Person",
      enum: "InPerson",
      placeholder: "Location to event",
    },
  ];
  const [active, setActive] = useState(
    eventPlatform === "Virtual" ? Platforms[0] : Platforms[1]
  );
  const [link, setLink] = useState(eventLink);
  const [image, setImage] = useState(eventImage);
  const [name, setName] = useState(eventName);
  const [date, setDate] = useState(eventDate);
  const [description, setDescription] = useState(eventDescription);
  const [content, setContent] = useState(eventContent);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const uploadImage = async (file) => {
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
      setImage(res.data.url);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const updateEvent = async () => {
    if (name.length > 3) {
      try {
        setLoading(true);
        let updates = {};

        updates = {
          id: eventId,
          name,
          description,
          content,
          date,
          link,
          image,
          platform: active.enum,
        };

        const { error } = await supabase.from("events").upsert(updates, {
          returning: "minimal",
        });

        if (error) {
          throw error;
        }

        toast({
          title: "Success",
          position: "bottom",
          description: "Event updated successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        window.location.reload();
      } catch (error) {
        console.log(error);
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
        description: "Event name should have more than 3 characters",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const EventPlatform = () => {
    return (
      <Box>
        <Flex
          fontSize="xl"
          fontWeight="semibold"
          color="brand.primary"
          alignItems="center"
          experimental_spaceX="3"
          mt="8"
          mb="4"
        >
          <MapPin /> <Text>Where will it happen? *</Text>
        </Flex>
        <Flex
          p="1.5"
          bg="whiteAlpha.200"
          w="-webkit-fit-content"
          experimental_spaceX="3"
          rounded="lg"
        >
          {Platforms.map((data, key) => (
            <Box
              onClick={() => {
                setActive(data);
                setLink("");
              }}
              cursor="pointer"
              color={data.name === active.name ? "white" : "whiteAlpha.800"}
              _hover={{ color: "white" }}
              transitionDuration="200ms"
              key={key}
              bg={data.name === active.name ? "whiteAlpha.300" : "transparent"}
              px="4"
              py="1"
              rounded="base"
            >
              {data.name}
            </Box>
          ))}
        </Flex>
      </Box>
    );
  };

  return (
    <Flex alignItems="center" mt="6" direction="column" color="white">
      <AspectRatio ratio={1920 / 1080} w="full" shadow="xl">
        <Box>
          <Image rounded="lg" src={image} />
          <Button
            position="absolute"
            bottom="0"
            left="0"
            m="4"
            size="sm"
            bg="blackAlpha.600"
            border="1px"
            onClick={() => document.getElementById("file").click()}
            borderColor="transparent"
            _hover={{ borderColor: "whiteAlpha.200", bg: "blackAlpha.800" }}
            _focus={{}}
            _active={{ bg: "blackAlpha.700" }}
          >
            {uploading ? <Spinner /> : <>Change cover photo</>}
          </Button>
        </Box>
      </AspectRatio>
      <Input
        type="file"
        accept="image/*"
        id="file"
        display="none"
        onChange={(e) => uploadImage(e.target.files[0])}
      />
      <Box w="full" mt="4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateEvent();
          }}
        >
          <Text color="white" fontWeight="medium" fontSize="sm">
            Event Name *
          </Text>
          <Input
            w="full"
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
            mt="1.5"
            py="5"
            isRequired={true}
            px="0"
            rounded="none"
            color="white"
            fontSize="xl"
            borderTop="none"
            borderRight="none"
            borderLeft="none"
            borderBottom="1px"
            _hover={{ borderColor: "whiteAlpha.900" }}
            _focus={{ borderColor: "brand.primary" }}
            borderColor="whiteAlpha.400"
            _placeholder={{ color: "whiteAlpha.400" }}
            placeholder="Designing Session"
          />
          <EventPlatform />
          <Input
            w="full"
            type="text"
            mt="3"
            py="5"
            rounded="lg"
            color="white"
            isRequired={true}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            _hover={{ borderColor: "whiteAlpha.900" }}
            _focus={{ borderColor: "brand.primary" }}
            borderColor="whiteAlpha.400"
            _placeholder={{ color: "whiteAlpha.400" }}
            placeholder={active.placeholder}
          />
          <Flex
            fontSize="xl"
            fontWeight="semibold"
            color="brand.primary"
            alignItems="center"
            experimental_spaceX="3"
            mt="8"
          >
            <Calendar /> <Text>When will it happen? *</Text>
          </Flex>
          <Flex experimental_spaceX="4" mt="2">
            <Input
              w="full"
              type="date"
              defaultValue={
                eventDate.year + "-" + eventDate.month + "-" + eventDate.date
              }
              placeholder="Date"
              onChange={(e) => {
                const dateString = e.target.value;
                console.log(dateString);
                const dateFormatted = dateString.split("-");
                setDate({
                  ...date,
                  date: dateFormatted[2],
                  month: dateFormatted[1],
                  year: dateFormatted[0],
                });
                console.log(date);
              }}
              mt="1.5"
              py="5"
              rounded="lg"
              isRequired={true}
              color="white"
              _hover={{ borderColor: "whiteAlpha.900" }}
              _focus={{ borderColor: "brand.primary" }}
              borderColor="whiteAlpha.400"
              _placeholder={{ color: "whiteAlpha.400" }}
            />
            <Input
              w={{ sm: "70%", lg: "40%" }}
              type="time"
              placeholder="Time"
              defaultValue={moment(eventDate.time, "hh:mm A").format("HH:mm")}
              onChange={(e) => {
                setDate({
                  ...date,
                  time: moment(e.target.value, "HH:mm").format("hh:mm A"),
                });
              }}
              mt="1.5"
              isRequired={true}
              py="5"
              rounded="lg"
              color="white"
              _hover={{ borderColor: "whiteAlpha.900" }}
              _focus={{ borderColor: "brand.primary" }}
              borderColor="whiteAlpha.400"
              _placeholder={{ color: "whiteAlpha.400" }}
            />
          </Flex>
          <Text mt="1" color="whiteAlpha.500">
            * Date and time is in GMT+5:30
          </Text>
          <Text color="white" fontWeight="medium" fontSize="sm" mt="6">
            Description
          </Text>
          <Input
            value={description}
            w="full"
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            mt="1.5"
            py="5"
            rounded="lg"
            color="white"
            _hover={{ borderColor: "whiteAlpha.900" }}
            _focus={{ borderColor: "brand.primary" }}
            borderColor="whiteAlpha.400"
            _placeholder={{ color: "whiteAlpha.400" }}
            placeholder="Describe about your event in brief"
          />
          <Text color="white" fontWeight="medium" fontSize="sm" mt="4">
            Content
          </Text>
          <Textarea
            w="full"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type="text"
            mt="1.5"
            py="3"
            rounded="lg"
            color="white"
            _hover={{ borderColor: "whiteAlpha.900" }}
            _focus={{ borderColor: "brand.primary" }}
            borderColor="whiteAlpha.400"
            _placeholder={{ color: "whiteAlpha.400" }}
            placeholder="Write about your event"
          />

          <Button
            color="black"
            float="right"
            mt="6"
            type="submit"
            rounded="lg"
            _focus={{}}
            _active={{}}
            leftIcon={
              loading ? <Spinner size="sm" /> : <CheckCircle size="20px" />
            }
          >
            Update Event
          </Button>
        </form>
      </Box>
    </Flex>
  );
}

export default UpdateEvent;
