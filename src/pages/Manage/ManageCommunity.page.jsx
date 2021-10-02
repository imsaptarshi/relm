/* eslint-disable react-hooks/exhaustive-deps */
import StarterTemplate from "../../components/Misc/StarterTemplace.component";
import {
  Flex,
  Box,
  Text,
  Divider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ArrowLeft, Settings } from "react-feather";
import { useEffect, useState } from "react";
import { supabase } from "../../Helpers/supabase";
import { User } from "../../Providers/User.provider";

function ManageCommunity(props) {
  const id = props.match.params.id;
  const [community, setCommunity] = useState(undefined);
  const { user } = User();

  useEffect(() => {
    getCommunity();
  }, []);

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

  return (
    <StarterTemplate communityId={id}>
      <Box maxW="1200px">
        <Flex alignItems="center" experimental_spaceX="2">
          <Box
            cursor="pointer"
            onClick={() => {
              window.location.href = "/home";
            }}
          >
            <ArrowLeft size="18px" />
          </Box>
          <Breadcrumb color="white">
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">{user?.username}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{community?.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Flex>
        <Flex justify="space-between" alignItems="end">
          <Box>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
              {community?.name}
            </Text>
            {community?.description ? (
              <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="thin">
                {community?.description}
              </Text>
            ) : (
              <></>
            )}
          </Box>
          <Box p="1">
            <Settings size="20px" />
          </Box>
        </Flex>
        <Divider mt="3" color="white" opacity="0.2" />
      </Box>
    </StarterTemplate>
  );
}

export default ManageCommunity;
