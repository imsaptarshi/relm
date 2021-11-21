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

const addDefaultRoute = (route) => {
  return app.get(route, (req, res) => {
    const filePath = path.resolve(__dirname, "./build", "index.html");
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        return console.log(err);
      }
      data = data
        .replace(/__TITLE__/g, "Relm - Activating your community")
        .replace(
          /__DESCRIPTION__/g,
          "Making communities more engaging with events, community analytics and newsletters with Relm"
        )
        .replace(/__IMAGE__/g, "https://i.ibb.co/47TKPtY/cover.png");

      res.send(data);
    });
  });
};

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

app.get("/feedback/:id", async (req, res) => {
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
      .replace(/__TITLE__/g, `${EventData.data.name} | Feedback - Relm`)
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

addDefaultRoute("/");
addDefaultRoute("/home");
addDefaultRoute("/signin");
addDefaultRoute("/auth");
addDefaultRoute("/new/community");
addDefaultRoute("/manage/community/:id");
addDefaultRoute("/manage/event/:id");
addDefaultRoute("/events");
addDefaultRoute("/new/event");
addDefaultRoute("/manage/community/:id/new/event");
addDefaultRoute("/manage/community/:id/events");
addDefaultRoute("/audience");
addDefaultRoute("/manage/community/:id/audience");
addDefaultRoute("/manage/community/:id/insights");
addDefaultRoute("/insights");

app.get("/wiki", (req, res) => {
  const filePath = path.resolve(__dirname, "./build", "index.html");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      return console.log(err);
    }
    data = data
      .replace(/__TITLE__/g, "Relm | Wiki")
      .replace(
        /__DESCRIPTION__/g,
        "Connecting communities and workspaces, made right with Relm."
      )
      .replace(
        /__IMAGE__/g,
        "https://relm-inc.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F894f0371-d791-4930-8756-7fe4eaeb21a2%2FMacBook_Pro_-_13_(1).png?table=block&id=5e264f8a-3a72-4c0b-bdf4-2f0e87d9174b&spaceId=90ec4053-02a2-4e2f-b334-579b66e56425&width=2000&userId=&cache=v2"
      );

    res.send(data);
  });
});

app.use(express.static(path.join(__dirname, "./build")));
app.use(express.static(path.join(__dirname, "./public")));
app.listen(PORT, () => {
  console.log("Server is listening");
});
