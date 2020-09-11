const express = require("express");
const router = express.Router()
const mongoose = require("mongoose")
require("../models/usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs");
const { route } = require("./admin");
const passport = require("passport")

router.get("/registro", (req, res) => {
  res.render("usuarios/registro")
})

router.post("/registro", (req,res) => {
  var erros = []

  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({texto: "Nome invalido!"})
  }

  if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
    erros.push({texto: "Email invalido!"})
  }

  if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
    erros.push({texto: "Senha invalido!"})
  }

  if (req.body.senha.length < 4) {
    erros.push({texto: "Senha muito curta!"})
  }

  if (req.body.senha != req.body.senha2) {
    erros.push({texto: "A senha são diferentes, tente novamente!"})
  }

  if (erros.length > 0) {
    res.render("usuarios/registro", {erros: erros})
  }else {
    Usuario.findOne({email: req.body.email}).then((usuario) => {
      if (usuario) {
        req.flash("error_msg", "já existe uma conta com esse email")
        res.redirect("/usuarios/registro")
      }else {
        const novoUsuarios = new Usuario({
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha,
          eAdmin: 1
        })

        bcrypt.genSalt(10, (erro, salt) => {
          bcrypt.hash(novoUsuarios.senha, salt, (erro, hash) => {
            if (erro) {
                req.flash("error_msg", "Houve um erro ao salvar o usuarios")
                res.redirect("/")
            }

            novoUsuarios.senha = hash

            novoUsuarios.save().then(() => {
              req.flash("success_msg", "Usuarios registrado com sucesso!")
              res.redirect("/")
            }).catch(err => {
              req.flash("error_msg", "Houve um erro ao criar o usuarios")
              res.redirect("usuarios/registro")
            }) 
          })
        })

      }
    }).catch((err) => {
      req.flash("erro_msg", "Houve um erro interno")
      res.redirect("/")
    })
  }
})

router.get("/login", (req, res) => {
  res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/usuarios/login",
    failureFlash: true
  })(req, res, next) 
  
})

router.get("/logout", (req, res) => {
  req.logout()
  req.flash("success_msg", "Deslogado com sucesso")
  res.redirect("/")
})

module.exports = router