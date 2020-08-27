const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/post", (req, res) => {
  res.render("pagina de  post");
});

router.get("/categoria", (req, res) => {
  res.render("./admin/categorias");
});

router.get("/categorias/add", (req, res) => {
  res.render("./admin/addcategorias")
})


router.post("/categoria/nova", (req, res) => {
  const novaCategoria = {
    nome: req.body.nome,
    slug: req.body.slug
  }

  new Categoria(novaCategoria).save().then(() => {
    console.log("Categoria salva!");
  }).catch( err => {
    console.log("erro ao salvar categoria!" + err);
  })
});

module.exports = router;