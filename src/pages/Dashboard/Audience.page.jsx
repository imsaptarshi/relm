/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { supabase } from "../../Helpers/supabase";
import { User } from "../../Providers/User.provider";
import StarterTemplate from "../../components/Misc/StarterTemplace.component";
import AudienceList from "../../components/Misc/AudienceList.component";
import CurrentLocation from "../../components/Misc/CurrentLocation.component";
import { Helmet } from "react-helmet";
import { Search } from "react-feather";

function Audience(props) {
  const id = props.match.params.id;
  const { user } = User();
  const [audience, setAudience] = useState(undefined);
  const [searchedAudience, setSearchedAudience] = useState(undefined);
  const [query, setQuery] = useState("");
  const [community, setCommunity] = useState(undefined);

  useEffect(() => {
    if (id) {
      getCommunity();
    }
    getAudience();
  }, []);

  const getAudience = async () => {
    try {
      if (id) {
        const { data, error } = await supabase
          .from("audience")
          .select("name, email, events")
          .contains("communities", [id])
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }
        setAudience(data);
      } else {
        const { data, error } = await supabase
          .from("audience")
          .select("name, email, events")
          .eq("createdBy", localStorage.getItem("email"))
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setAudience(data);
      }
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

  return (
    <StarterTemplate communityId={id}>
      <Helmet>
        <title>Audience | Relm</title>
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
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
          Audience
        </Text>
        <Divider mt="3" color="white" opacity="0.2" />
        <Box mt="6">
          <InputGroup>
            <InputLeftElement color="brand.primary">
              <Search size="18px" />
            </InputLeftElement>
            <Input
              onChange={(e) => {
                const query = e.target.value;
                setQuery(query);
                const queriedData = [];
                audience?.forEach((data) => {
                  if (
                    data.name.toLowerCase().startsWith(query.toLowerCase()) ||
                    data.email.toLowerCase().startsWith(query.toLowerCase())
                  ) {
                    queriedData.push(data);
                  }
                });
                setSearchedAudience(queriedData);
              }}
              py="5"
              rounded="xl"
              color="white"
              _hover={{ borderColor: "whiteAlpha.900" }}
              _focus={{ borderColor: "brand.primary" }}
              borderColor="whiteAlpha.400"
              _placeholder={{ color: "whiteAlpha.400" }}
              placeholder="Search"
            />
          </InputGroup>
          <AudienceList
            placeholder="No audience"
            audience={query.length > 0 ? searchedAudience : audience}
            communityId={id}
          />
        </Box>
      </Box>
    </StarterTemplate>
  );
}

export default Audience;
