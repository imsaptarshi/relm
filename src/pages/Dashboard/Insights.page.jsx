/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Box, Text, Divider, Flex } from "@chakra-ui/react";
import { supabase } from "../../Helpers/supabase";
import { User } from "../../Providers/User.provider";
import StarterTemplate from "../../components/Misc/StarterTemplace.component";
import CurrentLocation from "../../components/Misc/CurrentLocation.component";
import { Helmet } from "react-helmet";
import InsightCard from "../../components/Cards/InsightCard.component";
import "./insights.styles.css";

function Insights(props) {
  const id = props.match.params.id;
  const { user } = User();
  const [insights, setInsights] = useState(undefined);
  const [community, setCommunity] = useState(undefined);

  useEffect(() => {
    if (id) {
      getCommunity();
    }
    getInsights();
  }, []);

  const getInsights = async () => {
    try {
      if (id) {
        const { data, error } = await supabase
          .from("insights")
          .select("name, email, content, rating, event")
          .eq("community", id)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }
        console.log(data);
        setInsights(data);
      } else {
        const { data, error } = await supabase
          .from("insights")
          .select("name, email, content, rating, event")
          .eq("createdBy", localStorage.getItem("email"))
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setInsights(data);
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
        <title>Insights | Relm</title>
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
          Insights
        </Text>
        <Divider mt="3" color="white" opacity="0.2" />
      </Box>
      {insights ? (
        insights?.length > 0 ? (
          <Box id="insight-box" mt="6">
            {insights.map((data, key) => (
              <Box
                display="grid"
                style={{ breakInside: "avoid" }}
                gridTemplateRows="1fr auto"
              >
                <InsightCard key={key} {...data} />
              </Box>
            ))}
          </Box>
        ) : (
          <Flex
            color="whiteAlpha.600"
            my="10"
            justify="center"
            textAlign="center"
          >
            🐝 No insights received
          </Flex>
        )
      ) : (
        <></>
      )}
    </StarterTemplate>
  );
}

export default Insights;
