//Carregando modules
  const express = require("express");
  const handlebars = require("express-handlebars");
  const bodyParser = require("body-Parser")
  const app = express();
  const path = require("path");
  const admin = require("./routes/admin")
  //const mongoose = require("mongoose");

//Configurações
  //BodyParser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
  //Handlebars
    app.engine("handlebars", handlebars({defaultLayout: "main"}))
    app.set("view engine", "handlebars");
  // Mongoose
    //Em breve
  //Public
    app.use(express.static(path.join(__dirname, "public")));
//Rotas 
  app.get("/", (req, res) => {
    res.send("rota principal");
  });

  app.get("/", (req, res) => {
    res.send("rota de posts");
  });

  app.use("/admin", admin)
//Outros
const PORT= 5500
app.listen(PORT, () => {
  console.log("Servidor rodando!");
  console.log("URL: http://localhost:5500");
});