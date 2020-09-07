const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/postagens")
const Postagens = mongoose.model("postagens")

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/post", (req, res) => {
  res.render("pagina de  post");
});

router.get('/categorias', (req, res) => {
  Categoria.find().sort({date: "desc"}).then((categorias) => {
      res.render('./admin/categorias', {categorias: categorias.map(categorias => categorias.toJSON())})    
  }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar a categorias")
      res.redirect("/admin")
  });
})

router.get("/categorias/add", (req, res) => {
  res.render("./admin/addcategorias")
})


router.post("/categoria/nova", (req, res) => {
  
  var erros = [];
  
  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({text: "Nome inválido"})
  }

  if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
    erros.push({text: "Slug inválido"})
  }

  if (req.body.nome.lenght < 2) {
    erros.push({text: "Nome da categoria é muito pequeno"})
  }
  
  if (erros.length > 0) {
    res.render("admin/addcategorias", {erros: erross})
  }else {
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
    }
  
    new Categoria(novaCategoria).save().then(() => {
      req.flash("success_msg", "Categoria criada com sucesso!")
      res.redirect("/admin/categorias")
    }).catch( () => {
      req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
      res.redirect("/admin/categorias")
    })
  }
});

router.get("/categorias/edit/:id", (req, res) => {
  Categoria.findOne({_id: req.params.id}).lean().then(categoria => {
    res.render("admin/editcategorias", {categoria: categoria})
  }).catch(err => {
    req.flash("error_msg", "Este categoria não existe!")
    res.redirect("/admin/categorias")
  })
})

router.post("/categorias/edit", (req, res) => {
  Categoria.findOne({_id: req.body.id}).then(categoria => {

    categoria.nome = req.body.nome
    categoria.slug = req.body.slug

    categoria.save().then(() => {
      req.flash("success_msg", "Categoria editada com sucesso!")
      res.redirect("/admin/categorias")
    }).catch(err => {
      req.flash("error_msg", "Houve em erro interno ao salvar a edição da categoria!")
      res.redirect("/admin/categorias")
    })

  }).catch(err => {
    req.flash("error_msg", "Houve um erro ao editar a categoria!")
    res.redirect("/admin/categorias")
  })
})

router.get("/categorias/deletar/:id", (req, res) => {
  Categoria.remove({_id: req.params.id}).then(() => {
    req.flash("success_msg", "Categoria deletada com sucesso")
    res.redirect("/admin/categorias")
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao deletar a categoria")
    res.redirect("/admin/categorias")
  })
})

router.get("/postagens", (req, res) => {
  Postagens.find().populate("categoria").sort({data: 'desc'}).then((postagens) => {
    res.render("admin/postagens", {postagens: postagens.map(postagens => postagens.toJSON())});
  }).catch(err => {
    req.flash("error_msg", "Houve um erro ao listar as postagens");
    res.flash("/admin");
  })
})

router.get("/postagens/add", (req, res) => {
  Categoria.find().then((categorias) => {
    res.render("admin/addpostagens", {categorias: categorias.map(categorias => categorias.toJSON())})
  }).catch( err => {
    req.flash("error_msg", "Houve um erro ao carregar o formulario " + err)
    res.redirect("/admin/postagens")
  })
})

router.post("/postagens/nova", (req, res) => {
  var erros = [];
  
  if (!req.body.titulo || typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({text: "Titulo inválido"})
  }

  if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
    erros.push({text: "Slug inválido"})
  }

  if (!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
    erros.push({text: "Conteudo inválido"})
  }

  if (req.body.titulo.lenght < 2) {
    erros.push({text: "Titulo da Postagens é muito pequeno"})
  }

  if (req.body.categoria === "0") {
    erros.push({text: "Categoria invalida, registre uma categoria"})
  }
  if(erros.lenght > 0){
    res.render("admin/addpostagens", {erros: erros})
  } else {
    const novaPostagens = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
      slug: req.body.slug,
    }

    new Postagens(novaPostagens).save().then(() => {
      req.flash("success_msg" , "Postagens criada com successo")
      res.redirect("/admin/postagens")
    }).catch( err => {
      req.flash("error_msg", "Houve um erro ao salvamendo da postagens ")
      res.redirect("/admin/postagens")
    })
  } 

})

router.get("/postagens/edit/:id", (req, res) => {
  Postagens.findOne({_id: req.params.id}).lean().then((postagens) => {
    Categoria.find().then((categoria) => {
      res.render("admin/editpostagens", {categoria: categoria.map(categoria => categoria.toJSON()), postagens: postagens})
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar as categoria" + err)
      res.redirect("/admin/postagens")
    })
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao carregar o formulário de edição" + err)
    console.log(err);
    res.redirect("/admin/postagens")
  })
})

router.post("/postagens/edit", (req, res) => {
  Postagens.findOne({_id: req.body.id}).then((postagens) => {
    postagens.titulo = req.body.titulo,
    postagens.slug = req.body.slug,
    postagens.descricao = req.body.descricao,
    postagens.conteudo = req.body.conteudo
    postagens.categoria = req.body.categoria
    postagens.data = new Date

    postagens.save().then(() => {
      req.flash("success_msg", "Postagens editada com sucesso!")
      res.redirect("/admin/postagens")
    }).catch(() => {
      req.flash("error_msg", "Houve um erro ao editar a postagens!")
      res.redirect("/admin/postagens")
    })
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao salvar a categoria" + err)
    res.redirect("/admin/postagens")
  })
})

router.get("/postagens/delet/:id", (req,res) => {
  Postagens.remove({_id: req.params.id}).then(() => {
    req.flash("success_msg", "Postagens deletada com sucesso")
    res.redirect("/admin/postagens")
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro interno")
    res.redirect("/admin/postagens")
  })
})

module.exports = router;