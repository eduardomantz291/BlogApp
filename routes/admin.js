const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/post", (req, res) => {
  res.render("pagina de  post");
});

router.get("/categorias", (req, res) => {
  res.render("Pagina de categorias");
});

module.exports = router;