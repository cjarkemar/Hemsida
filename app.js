// Paket som är nödväniga? bra att ha
var express = require("express");
var app = express();
var exphbs = require("express-handlebars");
var path = require("path");
var bodyParser = require("body-parser");
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));

app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: false,
  })
);
app.set("view engine", ".hbs");

// Starta servern 
var port = process.env.PORT || 8080;
app.listen(port);
console.log("express server is running on port #", port);

// Hantera GET-request till rot-sökvägen
app.get("/", function (req, res, next) {
  // Läs innehållet från data.json-filen
  fs.readFile("data.json", function (err, content) {
    if (err) {
      console.error(err);
      return next(err);
    }

    // Konvertera innehållet till JSON-format
    const data = JSON.parse(content);

    
    res.render("home", { contacts: data });
  });
});

//  GET-request hantering för contact
app.get("/contact", function (reg, res) {
  // Rendera contact.hbs
  res.render("contact");
});

//  POST-request hanteringen contact
app.post("/contact", function (req, res, next) {
  console.log("contact form posted");
  console.log(req.body);

  // Skapa ett objekt med datan från POST-requesten
  const data = {
    name: req.body.fullname,
    email: req.body.email,
    subject: req.body.subject,
    note: req.body.note,
  };

  // Läs innehållet från data.json-filen
  fs.readFile("data.json", function (err, content) {
    if (err) {
      console.error(err);
      return next(err);
    }

    
    const json = JSON.parse(content);

    // Lägg till det nya objektet till arrayen
    json.push(data);

    // Skriv över data.json-filen med ny uppd dataa
    fs.writeFile("data.json", JSON.stringify(json), function (err) {
      if (err) {
        console.error(err);
        return next(err);
      }

      // Redirecta
      console.log("Data written to file successfully");
      res.redirect("/");
    });
  });
});