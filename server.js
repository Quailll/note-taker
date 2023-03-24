const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3001;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
      }
      res.json(JSON.parse(data))
    })
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    let newNotes = {
      title,
      text,
    };
    const notesString = JSON.stringify(newNotes);

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
      }

      const note = JSON.parse(data);
      note.push(newNotes);

      fs.writeFile(`./db/db.json`, JSON.stringify(note), (err) =>
        err
          ? console.error(err)
          : console.log(
              `Notes for ${newNotes.title} has been written to JSON file`
            )
      );
      const response = {
        status: "success",
        body: newNotes,
      };
      console.log(response);
      res.status(200).json(response);
    });
  } else {
    res.json(`Has to have title`);
  }
  console.log(req.body);
});
app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));
