// server/src/controllers/PinController.js
const Pin = require('../models/Pin');
const Usuario = require('../models/Usuario');
const path = require('path');
const fs = require('fs');

module.exports = {
  //FUNCAO PARA LISTAR todos os pins
async index(req, res) {
    try {
      const pins = await Pin.findAll({
        include: { model: Usuario, as: 'autor', attributes: ['nome'] }
      });
      return res.json(pins);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao listar os pins.' });
    }
  },

  //FUNCAO PARA MOSTRAR SO UM
  async show(req, res) {
    try{
      const { id } = req.params;
      const pin = await Pin.findByPk(id, {
        include: { model: Usuario, as: 'autor', attributes: ['nome'] }
      });

      if (!pin) {
        return res.status(404).json({ error: 'Pin não encontrado.' });
      }
      return res.json(pin);
    }catch(err){
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar o pin.' });
    }
  },
  
  //FUNCAO PARA CRIAR UM NOVO PIN
  async store(req, res) {
    //Pega os dados de TEXTO do req.body
    const { nome, descricao, latitude, longitude } = req.body;
    //Pega o nome do arquivo enviado
    const midia = req.file ? req.file.filename : null;
    const file_type = req.file ? req.file.mimetype : null; //salva o tipo do arquivo
    try {
      // Cria o Pin no banco
      const pin = await Pin.create({
        nome,
        descricao,
        latitude,
        longitude,
        midia,
        file_type, //salvara o tipo no banco
      });

      return res.status(201).json(pin);

    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: 'Erro ao salvar o pin.' });
    }
  },
  //FUNCAO PARA UPDATE DE PIN
  async update(req, res) {
    try{
      const { id } = req.params;
      const {nome, descricao} = req.body;

      const pin = await Pin.findByPk(id);
      if(!pin){
        return res.status(404).json({ error: 'Pin não encontrado.' });
      }
      //por logica do update de midia aqui

      await pin.update({ nome, descricao });
      return res.json(pin);
    }catch(err){
      console.error(err);
      return res.status(500).json({ error: 'Erro ao atualizar o pin.' });
    }
  },
  
  //FUNCAO PARA DELETAR UM PIN
  async destroy(req, res) {
    try{
      const { id } = req.params;
      const pin = await Pin.findByPk(id);
      if(!pin){
        return res.status(404).json({ error: 'Pin não encontrado.' });
      }
    //permissao  aqui depois
    
    const midiaFileName = pin.midia;
    await pin.destroy();

    //deleta o arquivo da PASTA UPLOADS
    if (midiaFileName) {
      const filePath = path.join(__dirname, '..', '..', 'uploads', midiaFileName);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Erro ao deletar o arquivo de mídia:', err);
        }
      });
    }
    return res.status(204).send(); //sucesso
    }catch(err){
      return res.status(500).json({ error: 'Erro ao deletar o pin.' });
    }
  }
};