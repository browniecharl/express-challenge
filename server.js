const PORT = process.env.PORT || 3001;
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", (req, res) => {
  let currentNote = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  res.json(currentNote[Number(req.params.id)]);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

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

app.listen(PORT, () => {
  console.log(`Now running server on port ${PORT}`);
});
