/* eslint-disable react-hooks/exhaustive-deps */
import Navigation from "../../components/Navigation/Navigation.component";
import {
  Flex,
  Box,
  AspectRatio,
  Image,
  Text,
  Input,
  Button,
  Divider,
  Link,
  Avatar,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "../../Helpers/supabase";
import { formatDate } from "../../Helpers/dateFormatter";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle,
  MapPin,
  XCircle,
} from "react-feather";
import Showdown from "showdown";
import "./event.css";
import EventHostCard from "./EventHostCard.component";
import { Helmet } from "react-helmet";

function Event(props) {
  const id = props.match.params.id;
  const [event, setEvent] = useState(undefined);
  const converter = new Showdown.Converter();
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const toast = useToast();

  useEffect(() => {
    getEvent();
    if (window.localStorage.getItem("email")) {
      getUser();
    }
  }, []);

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

  const getEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select(
          "name, description, date, community, image, content, platform, link, isListed, isOpen, createdBy, admin, audience"
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

  const registerUser = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("audience")
        .select("events, communities")
        .eq("email", email)
        .single();

      let events = [];
      let communities = [];
      if (data) {
        data.events.push(id);
        data.communities.push(event?.community);
        events = data.events;
        communities = data.communities;
      } else {
        events = [id];
        communities = [event?.community];
      }
      const updates = {
        email: email,
        name: name,
        events: [...new Set(events)],
        communities: [...new Set(communities)],
        createdBy: event?.admin,
      };

      await supabase.from("audience").upsert(updates, { returning: "minimal" });

      const AudienceEventData = await supabase
        .from("audience")
        .select("name, email, events")
        .contains("events", [id]);

      await supabase
        .from("events")
        .upsert(
          { id, audience: AudienceEventData.data.length },
          { returning: "minimal" }
        );
      if (event?.community) {
        const AudienceCommunityData = await supabase
          .from("audience")
          .select("name, email, events")
          .contains("communities", [event?.community]);

        await supabase.from("communities").upsert(
          {
            id: event?.community,
            audience: AudienceCommunityData.data.length,
          },
          { returning: "minimal" }
        );
      }
      toast({
        title: "Success",
        position: "bottom",
        description: "You are successfully registered!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setName("");
      setEmail("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const ProfileDisplay = () => {
    return (
      <Flex
        cursor="default"
        borderColor="transparent"
        transitionDuration="200ms"
        overflow="clip"
        mb="4"
        alignItems="center"
        rounded="xl"
        w="full"
        experimental_spaceX="4"
      >
        <Avatar size="md" src={user?.avatar_url} name={user?.username} />
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
          <Text align="left" color="white" whiteSpace="nowrap" fontSize="xs">
            {user?.email}
          </Text>
        </Box>
      </Flex>
    );
  };

  return (
    <>
      {event ? (
        <>
          {event?.isListed ? (
            <Flex bg="brand.secondary" justify="center" w="full">
              <Box
                minH="100vh"
                py="6"
                px={{ base: "6", md: "12" }}
                maxW="1100px"
                w="full"
                color="white"
              >
                <Box px={{ lg: "20" }}>
                  <Navigation communityId={event?.community} />
                </Box>
                <Box mx="auto" mt="6">
                  <AspectRatio ratio={1920 / 1080}>
                    <Image src={event?.image} rounded="xl" />
                  </AspectRatio>
                  <Box>
                    <Text fontWeight="bold" fontSize="3xl" mt="4">
                      {event?.name}
                    </Text>
                    <Flex
                      fontSize="sm"
                      color="brand.primary"
                      experimental_spaceX="1.5"
                      alignItems="center"
                      mt="1"
                    >
                      <Calendar size="18px" />
                      <Text>{formatDate(event?.date)}</Text>
                    </Flex>
                    <Flex direction={{ base: "column", md: "row" }}>
                      <Box w="full">
                        <Box mt="10">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (event?.isOpen) {
                                registerUser();
                              } else {
                                toast({
                                  title: "Error",
                                  position: "bottom",
                                  description:
                                    "Event registrations are already closed",
                                  status: "Error",
                                  duration: 5000,
                                  isClosable: true,
                                });
                              }
                            }}
                          >
                            <Text fontSize="xl" mb="3" fontWeight="medium">
                              Register for the event
                            </Text>
                            <Flex
                              bg="whiteAlpha.100"
                              p="5"
                              rounded="xl"
                              direction="column"
                              alignItems="end"
                            >
                              {window.localStorage.getItem("email") ? (
                                <ProfileDisplay />
                              ) : (
                                <>
                                  <Box w="full">
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
                                      mb="2"
                                      py="5"
                                      placeholder="Your name"
                                      _placeholder={{ color: "whiteAlpha.400" }}
                                    />
                                    <Input
                                      w="full"
                                      type="email"
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      id="email"
                                      required
                                      _focus={{
                                        border: "2px",
                                        borderColor: "brand.primary",
                                      }}
                                      bg="brand.secondary"
                                      border="2px"
                                      py="5"
                                      borderColor="transparent"
                                      rounded="lg"
                                      placeholder="Your email"
                                      _placeholder={{ color: "whiteAlpha.400" }}
                                    />
                                  </Box>
                                </>
                              )}
                              <Button
                                mt="4"
                                px="6"
                                type={event?.isOpen ? "submit" : "button"}
                                w="-webkit-fit-content"
                                cursor={
                                  event?.isOpen ? "pointer" : "not-allowed"
                                }
                                _hover={{}}
                                _active={{}}
                                _focus={{}}
                                leftIcon={
                                  event?.isOpen ? (
                                    loading ? (
                                      <Spinner size="sm" />
                                    ) : (
                                      <CheckCircle size="18px" />
                                    )
                                  ) : (
                                    <XCircle size="18px" />
                                  )
                                }
                                bg="brand.primary"
                                fontSize="sm"
                                rounded="lg"
                              >
                                {event?.isOpen ? (
                                  <>Register</>
                                ) : (
                                  <>Registrations are closed</>
                                )}
                              </Button>
                            </Flex>
                          </form>
                        </Box>
                        {event?.description || event?.content ? (
                          <Box mt="8">
                            <Text fontSize="xl" mb="4" fontWeight="medium">
                              Event Details :
                            </Text>
                            {event?.description ? (
                              <Text fontSize="lg" fontWeight="semibold">
                                {event?.description}
                              </Text>
                            ) : (
                              <></>
                            )}
                            {event?.content ? (
                              <Text
                                id="content"
                                fontSize="base"
                                mt="2"
                                fontWeight="thin"
                                dangerouslySetInnerHTML={{
                                  __html: converter.makeHtml(event?.content),
                                }}
                              ></Text>
                            ) : (
                              <></>
                            )}
                          </Box>
                        ) : (
                          <></>
                        )}
                      </Box>
                      <Box
                        minW={{ md: "240px", lg: "300px" }}
                        maxW={{ md: "240px", lg: "350px" }}
                        ml={{ md: "10" }}
                      >
                        <Box>
                          <Box mb="2">
                            <Text fontSize="xl" fontWeight="medium">
                              Join Details :
                            </Text>
                            <Flex
                              alignItems="center"
                              color="brand.primary"
                              cursor="pointer"
                              transitionDelay="200ms"
                              my="4"
                            >
                              {event?.platform === "Virtual" ? (
                                <>
                                  <Link
                                    isExternal
                                    href={event?.link}
                                    _focus={{}}
                                    fontSize="lg"
                                    mr="1"
                                    isTruncated
                                  >
                                    {event?.link}
                                  </Link>

                                  <Box
                                    minW="20px"
                                    onClick={() => {
                                      window.open(event?.link, "_blank");
                                    }}
                                  >
                                    <ArrowUpRight />
                                  </Box>
                                </>
                              ) : (
                                <Flex
                                  alignItems="start"
                                  w="-webkit-fit-content"
                                >
                                  <Box minW="20px">
                                    <MapPin size="18px" />
                                  </Box>
                                  <Text
                                    fontSize="lg"
                                    ml="2"
                                    mt="-1"
                                    wordBreak="break-all"
                                  >
                                    {event?.link}
                                  </Text>
                                </Flex>
                              )}
                            </Flex>
                          </Box>
                          <Divider color="white" opacity="0.2" />
                          <Box mt="6">
                            {event?.createdBy.map((data, key) => (
                              <EventHostCard key={key} email={data} />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                </Box>
              </Box>
            </Flex>
          ) : (
            <Flex
              minH="100vh"
              color="white"
              bg="brand.secondary"
              justify="center"
              alignItems="center"
            >
              lol 404
            </Flex>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Event;
