//Carregando modules
  const express = require("express");
  const handlebars = require("express-handlebars");
  const bodyParser = require("body-Parser")
  const app = express();
  const path = require("path");
  const admin = require("./routes/admin")
  const mongoose = require("mongoose");
  const session = require("express-session")
  const flash = require("connect-flash");
//Configurações
  //Sessão
    app.use(session({
      secret: "nomedomeupat",
      resave: true,
      saveUninitialized: true
    }));
    app.use(flash())
  //Middleware
    app.use((req, res, next) => {
      res.locals.success_msg = req.flash("success_msg")
      res.locals.error_msg = req.flash("error_msg")
      next()
    })
  //BodyParser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
  //Handlebars
    app.engine("handlebars", handlebars({defaultLayout: "main"}))
    app.set("view engine", "handlebars");
  // Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/blogapp", {
      useNewUrlParser: true, useUnifiedTopology: true
    }).then( () => {
      console.log("MongoDB conectado!");
    }).catch( err => {
      console.log("Houve um erro! " + err);
    })
  //Public
    app.use(express.static(path.join(__dirname, "public")));

    app.use((req, res, next) => {
      console.log("oi ssou gay");
      next()
    })
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