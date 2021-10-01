import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "../../Helpers/supabase";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const { data, error, status } = await supabase
        .from("users")
        .select("username, avatar_url, email")
        .eq("email", localStorage.getItem("email"))
        .single();

      if (error) {
        throw error;
      }

      setUser(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {`Username: ${user?.username}, Email:${user?.email}`}
      <Button
        onClick={() => {
          supabase.auth.signOut();
          localStorage.removeItem("email");
          window.location.href = "/";
        }}
      >
        Sign Out
      </Button>
    </>
  );
}

export default Home;
