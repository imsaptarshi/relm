import {
  BarChart,
  Calendar,
  Heart,
  Home,
  Mail,
  Plus,
  Users,
} from "react-feather";
import {
  Box,
  Text,
  Image,
  Flex,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";
import Logo from "../../Assets/logo.svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { features } from "../../Helpers/features";
import { User } from "../../Providers/User.provider";
import { supabase } from "../../Helpers/supabase";

function Sidebar({ communityId }) {
  const [active, setActive] = useState(window.location.pathname);
  const { user, setUser } = User();
  const [community, setCommunity] = useState(undefined);

  useEffect(() => {
    if (!user) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
    if (communityId) {
      getCommunity(communityId);
    }
  }, [communityId, setUser, user]);

  const getCommunity = async (id) => {
    try {
      console.log(localStorage.getItem("email"));
      const { data, error } = await supabase
        .from("communities")
        .select("id, name, logo ,description,audience,events")
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

  const SidebarItems = [
    {
      name: "Home",
      isExternal: false,
      link: communityId ? `/manage/community/${communityId}` : "/home",
      Icon: (props) => <Home {...props} />,
    },
    {
      name: "Audience",
      isExternal: false,
      link: "/audience",
      Icon: (props) => <Users {...props} />,
    },
    {
      name: "Events",
      isExternal: false,
      link: communityId ? `/manage/community/${communityId}/events` : "/events",
      Icon: (props) => {
        return <Calendar {...props} />;
      },
    },
    {
      name: "Insights",
      isExternal: false,
      link: "/insights",
      Icon: (props) => {
        return <BarChart {...props} />;
      },
    },
    {
      name: "Newsletter",
      isExternal: false,
      link: "#",
      Icon: (props) => {
        return <Mail {...props} />;
      },
    },
    {
      name: "Explore",
      isExternal: false,
      link: "#",
      Icon: (props) => {
        return <Heart {...props} />;
      },
    },
  ];

  const CommunityDisplay = ({ name, logo }) => {
    return (
      <Flex mb="6" display="flex" alignItems="center" experimental_spaceX="2">
        <Image
          src={logo}
          alt={name}
          w={{ base: "10", lg: "8" }}
          h={{ base: "10", lg: "8" }}
          rounded="full"
        />
        <Text
          whiteSpace="nowrap"
          color="white"
          display={{ base: "none", lg: "block" }}
          fontWeight="bold"
          fontSize="xl"
        >
          {name}
        </Text>
      </Flex>
    );
  };

  const SidebarItem = ({ name, link, Icon }) => {
    const isEnabled = features[name]
      ? features[name]?.enabled
        ? true
        : false
      : true;

    return (
      <Link to={isEnabled ? link : "#"} onClick={() => setActive(name)}>
        <Tooltip label={name} display={{ lg: "none" }} placement="right">
          <Flex
            opacity={isEnabled ? "1" : "0.5"}
            cursor={isEnabled ? "pointer" : "not-allowed"}
            experimental_spaceX="3"
            fontSize="lg"
            color={active === link ? "brand.primary" : "white"}
            alignItems="center"
          >
            <Icon fill={active === link ? "#FF4085" : "none"} />
            <Text
              display={{ base: "none", lg: "block" }}
              fontWeight={active === link ? "bold" : "normal"}
            >
              {name}
            </Text>
          </Flex>
        </Tooltip>
      </Link>
    );
  };

  return (
    <Box>
      <Flex
        overflowY="auto"
        overflowX="clip"
        direction="column"
        justify="space-between"
        alignItems={{ base: "center", lg: "start" }}
        w={{ base: "80px", md: "100px", lg: "360px" }}
        bg="black.400"
        h="100vh"
        position="fixed"
        p={{ base: "6", lg: "10" }}
      >
        <Box w={{ lg: "full" }}>
          <Image src={Logo} alt="relm" w="10" h="10" />
          <Box px={{ base: "0", lg: "10" }} mt="50px">
            {communityId ? (
              community ? (
                <CommunityDisplay
                  name={community?.name}
                  logo={community?.logo}
                />
              ) : (
                <Flex
                  mb="6"
                  display="flex"
                  alignItems="center"
                  experimental_spaceX="2"
                >
                  <Skeleton
                    w={{ base: "10", lg: "8" }}
                    h={{ base: "10", lg: "8" }}
                    rounded="full"
                  />
                  <Skeleton rounded="xl" h="6" w="20" />
                </Flex>
              )
            ) : (
              <></>
            )}

            <Button
              onClick={() => {
                const to = communityId
                  ? `/manage/community/${communityId}/new/event`
                  : "/new/event";
                window.location.href = to;
              }}
              _hover={{ bg: "#DD3370" }}
              transitionDuration="200ms"
              _focus={{}}
              _active={{}}
              size="sm"
              py="5"
              w={{ base: "10", lg: "full" }}
              rounded={{ base: "full", lg: "xl" }}
              color="white"
              bg="brand.primary"
            >
              <Text display={{ base: "none", lg: "block" }}>
                Create new event
              </Text>
              <Box display={{ base: "block", lg: "none" }}>
                <Plus />
              </Box>
            </Button>
            <Flex
              alignItems={{ base: "center", lg: "start" }}
              mt="8"
              direction="column"
              experimental_spaceY="5"
            >
              {SidebarItems.map((data, key) => (
                <SidebarItem key={key} {...data} />
              ))}
            </Flex>
          </Box>
        </Box>
        <Flex
          p={{ base: "0", md: "2" }}
          w={{ base: "-webkit-fit-content", lg: "full" }}
          bg="whiteAlpha.300"
          rounded="full"
          alignItems="center"
        >
          <Menu>
            <MenuButton>
              <Flex alignItems="center" experimental_spaceX="2" overflow="clip">
                <Avatar
                  size="md"
                  src={user?.avatar_url}
                  name={user?.username}
                />
                <Box display={{ base: "none", lg: "block" }}>
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
            </MenuButton>
            <MenuList
              bg="brand.secondary"
              m="2"
              borderColor="gray.700"
              color="white"
            >
              <MenuItem
                _hover={{ bg: "whiteAlpha.50" }}
                _focus={{ bg: "whiteAlpha.50" }}
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/";
                  setUser(undefined);
                  localStorage.removeItem("user");
                  localStorage.removeItem("email");
                }}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Box
        w={{ base: "0", md: "100px", lg: "360px" }}
        bg="pink"
        h="full"
        minH="100vh"
      ></Box>
    </Box>
  );
}

export default Sidebar;
