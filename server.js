const PORT = process.env.PORT || 3001;
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

// This route will get the homepage and display to the browser

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//// This route will get the 'notes' page and display to the browser

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// This route will get the note data from the db.json and send it to the 'notes' page

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

// This route gets a single note by ID

app.get("/api/notes/:id", (req, res) => {
  let currentNote = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  res.json(currentNote[Number(req.params.id)]);
});

// This route links to the homepage if there is an error in an API call

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// This route is able to create a new note and post it to the db.json

app.post("/api/notes", (req, res) => {
  let currentNote = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let newNote = req.body;
  let noteID = currentNote.length.toString();

  newNote.id = noteID;
  currentNote.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(currentNote));
  console.log("Note has been saved. Note info: ", newNote);
  res.json(currentNote);
});

// This route makes it possible to delete a single note

app.delete("/api/notes/:id", (req, res) => {
  let currentNote = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteID = req.params.id;
  let newNoteID = 0;

  currentNote = currentNote.filter((theNote) => {
    return theNote.id != noteID;
  });

  for (theNote of currentNote) {
    theNote.id = newNoteID.toString();
    newNoteID++;
  }

  fs.writeFileSync("./db/db.json", JSON.stringify(currentNote));
  res.json(currentNote);
});

// This wil listen for the server to start and log to the console that it is now running

app.listen(PORT, () => {
  console.log(`Now running server on port ${PORT}`);
});
