const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//Model Usuario
require("../models/usuario")
const Usuario = mongoose.model("usuarios")

module.exports = function(passport) {
  passport.use(new LocalStrategy({usernameField: "email", passwordField: "senha"}, (email, senha, done) => {
    Usuario.findOne({email: email}).then((usuario) => {
      if (!usuario) {
        return done(null, false, {message: "Esta conta não existe"})
      }else {
        bcrypt.compare(senha, usuario.senha,  (erro, batem) => {
          if (batem) {
            return done(null, usuario, {message: "Logado com successo"})
          } else {
            return done(null, false, {message: "Senha ou email Incorreto"})
          }
        })
      }
    })
  }))
  passport.serializeUser((usuario, done) => {
    done(null, usuario.id)
  })

  passport.deserializeUser((id, done) => {
    Usuario.findById(id, (err, usuario) => {
      done(err, usuario)
    })
  })
}