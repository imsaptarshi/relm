import Sidebar from "../../components/Navigation/Sidebar.component";
import { Flex, Box, Image } from "@chakra-ui/react";
import { useState } from "react";
import { X, Menu } from "react-feather";
import Logo from "../../Assets/logo.svg";

function StarterTemplate({ children, communityId }) {
  const [sidebarVisibility, setSidebarVisibility] = useState(false);

  return (
    <Flex>
      <Box
        zIndex={2}
        display={{ base: sidebarVisibility ? "block" : "none", md: "block" }}
      >
        <Sidebar communityId={communityId} />
      </Box>
      <Box
        p={{ base: "5", md: "10" }}
        bg="brand.secondary"
        w="full"
        minH="100vh"
        color="white"
      >
        <Flex
          display={{ base: "flex", md: "none" }}
          m="-2"
          justify="space-between"
          mb="4"
          alignItems="center"
        >
          <Image src={Logo} alt="relm" w="10" h="10" ml="1" mt="2" />
          <Box
            cursor="pointer"
            onClick={() => setSidebarVisibility(!sidebarVisibility)}
            rounded="full"
            p="2"
            _hover={{ bg: "whiteAlpha.200" }}
          >
            {sidebarVisibility ? <X /> : <Menu />}
          </Box>
        </Flex>
        {children}
      </Box>
    </Flex>
  );
}

export default StarterTemplate;
