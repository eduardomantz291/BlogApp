//Carregando modules
  const express = require("express");
  const handlebars = require("express-handlebars");
  const bodyParser = require("body-Parser")
  const app = express();
  const path = require("path");
  const admin = require("./routes/admin")
  const usuarios = require("./routes/usuario")
  const mongoose = require("mongoose");
  const session = require("express-session")
  const flash = require("connect-flash");
  const passport = require("passport");
  require("./models/postagens")
  const Postagens = mongoose.model("postagens") 
  require("./models/Categoria")
  const Categoria = mongoose.model("categorias")
  require("./models/usuario")
  const Usuario = mongoose.model("usuarios")
  require("./config/auth")(passport)
//Configurações
  //Sessão
    app.use(session({
      secret: "usuarios",
      resave: true,
      saveUninitialized: true
    }));

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash())
  //Middleware
    app.use((req, res, next) => {
      res.locals.success_msg = req.flash("success_msg")
      res.locals.error_msg = req.flash("error_msg")
      res.locals.error = req.flash("error")
      res.locals.user = req.user || null
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

  app.get('/postagens/:slug', (req,res) => {
    Postagens.findOne({slug: req.params.slug}).then(postagens => {
      if (postagens) {
        const post = {
            titulo: postagens.titulo,
            data: postagens.data,
            conteudo: postagens.conteudo
        }
        res.render('page/post', post)
      } else {
        req.flash("error_msg", "Essa postagem nao existe")
        res.redirect("/")
      }
    }).catch(err => {
      req.flash("error_msg", "Houve um erro interno" + err)
      res.redirect("/")
    })
 })

  app.get("/categorias", (req, res) => {
    Categoria.find().then((categorias) => {
      res.render("page/categoria", {categorias: categorias.map(categorias => categorias.toJSON())})
    }).catch((err) => {
      req.flash("erro_mgs", "Houve um erro ao carregar as categorias")
    })
  })

  app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).then((categoria) => {
      if (categoria) {
        Postagens.find({categoria: categoria._id}).populate("categoria").then((postagens) => {
          res.render("page/postagens", {postagens: postagens.map(postagens => postagens.toJSON()), categoria: categoria})
        }).catch((err) => {
          req.flash("error_msg", "Houve um erro ao listar as postagens" + err)
          res.redirect("/categorias")
        })
      }else {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/categorias")
      }
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar a página desta categoria" + err)
      res.redirect("/")
    })
  })

  app.get("/404", (req, res) => {
    res.send("Erro GET 404!")
  })

  app.use("/admin", admin)
  app.use("/usuarios", usuarios)
//Outros
const PORT= 5500
app.listen(PORT, () => {
  console.log("Servidor rodando!");
  console.log("URL: http://localhost:5500");
});