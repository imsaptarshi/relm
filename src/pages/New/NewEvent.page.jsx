/* eslint-disable react-hooks/exhaustive-deps */
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
  AspectRatio,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import StarterTemplate from "../../components/Misc/StarterTemplace.component";
import { User } from "../../Providers/User.provider";
import { ArrowLeft, Calendar, CheckCircle, MapPin } from "react-feather";
import { supabase } from "../../Helpers/supabase";
import moment from "moment";
import axios from "axios";
import { useHistory } from "react-router";
import CurrentLocation from "../../components/Misc/CurrentLocation.component";
import { Helmet } from "react-helmet";

function NewEvent(props) {
  const id = props.match.params.id;
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
  const { user } = User();
  const [active, setActive] = useState(Platforms[0]);
  const [link, setLink] = useState("");
  const [image, setImage] = useState(
    "https://ik.imagekit.io/86h5mrsjotwk/defaultEvent_GGD_P8xy-jP.png?updatedAt=1633174215871"
  );
  const [name, setName] = useState("");
  const [date, setDate] = useState({});
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [community, setCommunity] = useState(undefined);
  const [communitySelected, setCommunitySelected] = useState("None");
  const [communities, setCommunities] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  useEffect(() => {
    if (id) {
      getCommunity();
    }
    getCommunities();
  }, []);

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

  const getCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from("communities")
        .select("id, name")
        .contains("createdBy", [localStorage.getItem("email")]);

      if (error) {
        throw error;
      }

      setCommunities(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCommunity = async () => {
    try {
      console.log(localStorage.getItem("email"));
      const { data, error } = await supabase
        .from("communities")
        .select("id, name, logo,description,audience,events")
        .contains("createdBy", [localStorage.getItem("email")])
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      setCommunity(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createEvent = async () => {
    if (name.length > 3) {
      setImage(image);
      try {
        setLoading(true);
        let updates = {};

        if (id) {
          updates = {
            name,
            description,
            content,
            date,
            link,
            image,
            admin: localStorage.getItem("email"),
            platform: active.enum,
            createdBy: [localStorage.getItem("email")],
            community: id,
          };
          const { data } = await supabase
            .from("communities")
            .select("id, events")
            .eq("id", id)
            .single();

          await supabase
            .from("communities")
            .upsert(
              { id: data.id, events: data.events + 1 },
              { returning: "minimal" }
            )
            .single();
        } else {
          updates = {
            name,
            description,
            content,
            date,
            link,
            image,
            admin: localStorage.getItem("email"),
            platform: active.enum,
            createdBy: [localStorage.getItem("email")],
            community: communitySelected === "None" ? null : communitySelected,
          };
        }

        const EventData = await supabase
          .from("events")
          .upsert(updates)
          .single();
        if (communitySelected !== "None") {
          const { data } = await supabase
            .from("communities")
            .select("id, events")
            .eq("id", communitySelected)
            .single();

          await supabase
            .from("communities")
            .upsert(
              { id: data.id, events: data.events + 1 },
              { returning: "minimal" }
            );
        }

        if (EventData.error) {
          throw EventData.error;
        }

        toast({
          title: "Success",
          position: "bottom",
          description: "Event created successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setTimeout(() => {
          window.location.href = `/manage/event/${EventData.data.id}`;
        }, 1000);
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
    <StarterTemplate communityId={id}>
      <Helmet>
        <title>New Event | Relm</title>
      </Helmet>
      <Box>
        {id ? (
          <CurrentLocation
            username={user?.username}
            communityName={community?.name}
          />
        ) : (
          <></>
        )}

        <Flex alignItems="center" experimental_spaceX="4">
          {!id ? (
            <Box
              cursor="pointer"
              p="2"
              onClick={() => {
                history.goBack();
              }}
              rounded="full"
              _hover={{ bg: "whiteAlpha.200" }}
            >
              <ArrowLeft />
            </Box>
          ) : (
            <></>
          )}
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
            Create Event
          </Text>
        </Flex>
        <Divider mt="3" color="white" opacity="0.2" />
      </Box>
      <Flex alignItems="center" mt="6" direction="column">
        <AspectRatio
          ratio={1920 / 1080}
          w={{ base: "full", md: "80%", lg: "70%" }}
          shadow="xl"
        >
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
        <Box w={{ base: "full", md: "80%", lg: "70%" }} mt="4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createEvent();
            }}
          >
            <Text color="white" fontWeight="medium" fontSize="sm">
              Event Name *
            </Text>
            <Input
              w="full"
              onChange={(e) => setName(e.target.value)}
              type="text"
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
            {!community ? (
              <>
                <Text color="white" fontWeight="medium" fontSize="sm" mt="4">
                  Community
                </Text>
                <Select
                  color="white"
                  _hover={{ borderColor: "whiteAlpha.900" }}
                  _focus={{ borderColor: "brand.primary" }}
                  borderColor="whiteAlpha.400"
                  _placeholder={{ color: "whiteAlpha.400" }}
                  mt="2"
                  onChange={(e) => setCommunitySelected(e.target.value)}
                >
                  <option
                    style={{ color: "white", backgroundColor: "black" }}
                    value={null}
                  >
                    None
                  </option>
                  {communities?.map((data, key) => (
                    <option
                      key={key}
                      style={{ color: "white", backgroundColor: "black" }}
                      value={data.id}
                    >
                      {data.name}
                    </option>
                  ))}
                </Select>
              </>
            ) : (
              <></>
            )}
            <Button
              color="black"
              float="right"
              mt="6"
              type="submit"
              rounded="lg"
              _focus={{}}
              _active={{}}
              leftIcon={loading ? <Spinner /> : <CheckCircle size="20px" />}
            >
              {loading ? <></> : <>Create Event</>}
            </Button>
          </form>
        </Box>
      </Flex>
    </StarterTemplate>
  );
}

export default NewEvent;
