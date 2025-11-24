const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarios-controller.js");
const verificarSessao = require("../middlewares/auth.js");

router.post("/criar-usuario", usuarioController.criar_usuario);

router.post("/login", usuarioController.verificarLogin);
router.get("/menu", verificarSessao, (req, res) => {
  if(req.session.user.tipo === 'candidato'){
    res.sendFile("index.html", { root: "public" });
  }else{
    res.sendFile("empresa-home.html", { root: "public"});
  }
});
router.post("/logout", usuarioController.logout);

router.patch("/atualizar-foto", usuarioController.upload.single('foto'), usuarioController.atualizar_foto_usuario);

module.exports = router;