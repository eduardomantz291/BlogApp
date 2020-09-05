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
  require("./models/postagens")
  const Postagens = mongoose.model("postagens") 
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
      console.log("Houve um erro ao se conectar! " + err);
    })
  //Public
    app.use(express.static(path.join(__dirname, "public")));
//Rotas 
  app.get("/", (req, res) => {
    Postagens.find().populate("categoria").sort({data: "desc"}).then((postagens) => {
      res.render("index", {postagens: postagens.map(postagens => postagens.toJSON())})
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro interno")
      res.redirect("/404")
    })
  });

  app.get("/postagens/:slug", (req, res) => {
    Postagens.findOne({slug: req.params.slug}).then((postagens) => {
      if (postagens) {
        res.render("post/index", {postagens: postagens.map(postagens => postagens.toJSON())})
      } else {
        res.flash("error_msg", "Esta postagens não existe!")
        res.redirect("/")
      }
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro interno")
      res.redirect("/")
    })
  })

  app.get("/404", (req, res) => {
    res.send("Erro GET 404! 472617tgdf78tya78tvfef@$QWRFQW%$WTYGEASD@!TESGBVEG#%#@¨@$&$TR#$@¨TET#Y&RGSGSADGGD$#¨TY$rfjdshoig4e")
  })

  app.use("/admin", admin)
//Outros
const PORT= 5500
app.listen(PORT, () => {
  console.log("Servidor rodando!");
  console.log("URL: http://localhost:5500");
});