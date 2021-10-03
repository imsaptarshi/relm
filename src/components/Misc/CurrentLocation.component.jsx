import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  Flex,
} from "@chakra-ui/react";
import { ArrowLeft } from "react-feather";
import { useHistory } from "react-router";

function CurrentLocation({ username, communityName }) {
  const history = useHistory();

  return (
    <Flex alignItems="center" experimental_spaceX="2">
      <Box
        cursor="pointer"
        onClick={() => {
          history.goBack();
        }}
      >
        <ArrowLeft size="18px" />
      </Box>
      <Breadcrumb color="white">
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">{username}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">{communityName}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </Flex>
  );
}

export default CurrentLocation;
