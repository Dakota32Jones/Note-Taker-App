const express = require("express");
const path = require("path");
const notesDB = require("./db/db.json");
const fs = require("fs");

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// get a copy of the notes array.
app.get("/api/notes", (req, res) => {
  res.json(notesDB.slice(1));
});

// getting index page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// getting notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// creating a function to create a new note

function createNewNote(body, notesArray) {
  const newNote = body;
  if (!Array.isArray(notesArray)) notesArray = [];

  if (notesArray.length === 0) notesArray.push(0);

  body.id = notesArray[0];
  notesArray[0]++;

  notesArray.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notesArray, null, 2)
  );
  return newNote;
}

// post route for notes

app.post("/api/notes", (req, res) => {
  const newNote = createNewNote(req.body, notesDB);
  res.json(newNote);
});

// adding delete function for notes

function deleteNote(id, notesArray) {
  for (let i = 0; i < notesArray.length; i++) {
    let note = notesArray[i];

    if (note.id == id) {
      notesArray.splice(i, 1);
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notesArray, null, 2)
      );

      break;
    }
  }
}

// adding delete route to delete notes

app.delete("/api/notes/:id", (req, res) => {
  deleteNote(req.params.id, notesDB);
  res.json(true);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
