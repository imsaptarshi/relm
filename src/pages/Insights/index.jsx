/* eslint-disable react-hooks/exhaustive-deps */
import Navigation from "../../components/Navigation/Navigation.component";
import {
  Box,
  Flex,
  Text,
  Input,
  Textarea,
  Avatar,
  Divider,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "../../Helpers/supabase";
import Footer from "../../components/Footer/Footer.component";
import { CheckCircle, Send } from "react-feather";

function Feedback(props) {
  const id = props.match.params.id;
  const [event, setEvent] = useState(undefined);
  const [community, setCommunity] = useState(undefined);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [rating, setRating] = useState("🤩");
  const Ratings = ["🤩", "🙂", "😐", "😔", "😡"];
  const [user, setUser] = useState(undefined);

  const toast = useToast();

  useEffect(() => {
    getEvent();
    if (event?.community) {
      getCommunity(event?.community);
    }
    if (window.localStorage.getItem("email")) {
      getUser();
    }
  }, [event?.community]);

  const createFeedback = async () => {
    try {
      setLoading(true);
      const updates = {
        name,
        email,
        content,
        rating,
        event: event?.id,
        community: community?.id,
        createdBy: event?.admin,
      };

      const { error } = await supabase
        .from("insights")
        .upsert(updates, { returning: "minimal" });

      if (error) {
        throw error;
      }
      setIsDone(true);
      if (!user) {
        setName("");
        setEmail("");
      }
      setContent("");
      setRating("🤩");
      toast({
        title: "Success",
        position: "bottom",
        description: "We are happy to get your feedback 😄",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username, avatar_url, email")
        .eq("email", window.localStorage.getItem("email"))
        .single();

      if (error) {
        throw error;
      }

      setUser(data);
      setName(data.username);
      setEmail(data.email);
    } catch (error) {
      console.log(error);
    }
  };

  const getCommunity = async (communityId) => {
    try {
      const { data, error } = await supabase
        .from("communities")
        .select("id, name, logo")
        .eq("id", communityId)
        .single();

      if (error) {
        throw error;
      }

      setCommunity(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(
          "id, name, description, date, community, image, content, platform, link, isListed, isOpen, createdBy, admin, audience"
        )
        .eq("id", id)
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
    <>
      {event ? (
        <>
          {event?.isListed ? (
            <Flex
              bg="brand.secondary"
              alignItems="center"
              w="full"
              direction="column"
            >
              <Box
                minH="100vh"
                py="6"
                px={{ base: "6", md: "12" }}
                maxW="1100px"
                w="full"
                color="white"
              >
                <Box>
                  <Navigation communityId={event?.community} />
                </Box>
                <Box mt="20">
                  <Text fontSize="2xl" mb="3" fontWeight="bold">
                    {community ? <>{community?.name}</> : <>We</>} would love
                    your feedback
                  </Text>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      createFeedback();
                    }}
                  >
                    <Flex
                      bg="whiteAlpha.100"
                      p="5"
                      rounded="xl"
                      direction="column"
                    >
                      {user ? (
                        <Flex
                          cursor="default"
                          borderColor="transparent"
                          transitionDuration="200ms"
                          overflow="clip"
                          mb="2"
                          alignItems="center"
                          rounded="xl"
                          w="full"
                          experimental_spaceX="4"
                        >
                          <Avatar
                            size="md"
                            src={user?.avatar_url}
                            name={user?.username}
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
                              fontSize="xs"
                            >
                              {user?.email}
                            </Text>
                          </Box>
                        </Flex>
                      ) : (
                        <Flex
                          experimental_spaceX={{ base: "0", md: "5" }}
                          experimental_spaceY={{ base: "3", md: "0" }}
                          direction={{ base: "column", md: "row" }}
                        >
                          <Input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            w="full"
                            _focus={{
                              border: "2px",
                              borderColor: "brand.primary",
                            }}
                            bg="brand.secondary"
                            border="2px"
                            borderColor="transparent"
                            rounded="lg"
                            py="5"
                            placeholder="Your name"
                            _placeholder={{ color: "whiteAlpha.400" }}
                          />
                          <Input
                            required
                            value={email}
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            w="full"
                            _focus={{
                              border: "2px",
                              borderColor: "brand.primary",
                            }}
                            bg="brand.secondary"
                            border="2px"
                            borderColor="transparent"
                            rounded="lg"
                            py="5"
                            placeholder="Your email"
                            _placeholder={{ color: "whiteAlpha.400" }}
                          />
                        </Flex>
                      )}
                      <Textarea
                        required
                        value={content}
                        type="email"
                        onChange={(e) => setContent(e.target.value)}
                        w="full"
                        _focus={{
                          border: "2px",
                          borderColor: "brand.primary",
                        }}
                        bg="brand.secondary"
                        border="2px"
                        borderColor="transparent"
                        rounded="lg"
                        mt="4"
                        minH="200px"
                        py="5"
                        placeholder="Your message to us"
                        _placeholder={{ color: "whiteAlpha.400" }}
                      />
                      <Flex
                        fontSize={{ base: "2xl", md: "3xl" }}
                        experimental_spaceX={{ base: "2", md: "3" }}
                        mt="4"
                      >
                        {Ratings.map((data, key) => (
                          <Flex
                            onClick={() => setRating(data)}
                            cursor="pointer"
                            _hover={{ transform: "scale(1.1)", filter: "none" }}
                            transitionDuration="100ms"
                            justify="center"
                            alignItems="center"
                            p="2"
                            rounded="full"
                            w={{ base: "10", md: "14" }}
                            h={{ base: "10", md: "14" }}
                            bg={rating === data ? "whiteAlpha.200" : ""}
                            filter={rating === data ? "none" : "grayscale(80%)"}
                            key={key}
                          >
                            {data}
                          </Flex>
                        ))}
                      </Flex>

                      <Flex justify="end">
                        <Button
                          type="submit"
                          mt="4"
                          bg="brand.primary"
                          fontSize="sm"
                          rounded="lg"
                          _hover={{}}
                          _active={{}}
                          _focus={{}}
                          rightIcon={
                            loading ? (
                              <Spinner size="sm" />
                            ) : isDone ? (
                              <CheckCircle size="18px" />
                            ) : (
                              <Send size="18px" />
                            )
                          }
                          w="-webkit-fit-content"
                        >
                          {isDone ? <>Feedback sent</> : <>Send</>}
                        </Button>
                      </Flex>
                    </Flex>
                  </form>
                </Box>
              </Box>
              <Box w="full" mt="10">
                <Divider opacity="0.1" />
                <Footer />
              </Box>
            </Flex>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Feedback;
