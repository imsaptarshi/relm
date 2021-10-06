const express = require("express");
const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/event/:id", async (req, res) => {
  const filePath = path.resolve(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf-8", async (err, data) => {
    if (err) {
      return console.log(err);
    }
    const EventData = await supabase
      .from("events")
      .select(
        "name, description, date, community, image, content, platform, link, isListed, isOpen, createdBy, admin, audience"
      )
      .eq("id", req.params.id)
      .single();
    data = data
      .replace(/__TITLE__/g, `${EventData.data.name} - Relm`)
      .replace(
        /__DESCRIPTION__/g,
        EventData.data.description.length > 0
          ? EventData.data.description
          : "Making communities more engaging with events, community analytics and newsletters with Relm"
      )
      .replace(/__IMAGE__/g, EventData.data.image);

    res.send(data);
  });
});

app.get("/", (req, res) => {
  const filePath = path.resolve(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    data = data
      .replace(/__TITLE__/g, "Relm")
      .replace(
        /__DESCRIPTION__/g,
        "Making communities more engaging with events, community analytics and newsletters with Relm"
      );

    res.send(data);
  });
});

app.use(express.static(path.resolve(__dirname, "./build")));
app.listen(PORT, () => {
  console.log("Server is listening");
});