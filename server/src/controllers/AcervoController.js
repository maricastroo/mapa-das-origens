// src/controllers/AcervoController.js
const Acervo = require('../models/Acervo');
const Usuario = require('../models/Usuario');
const fs = require('fs'); 
const path = require('path'); 
module.exports = {
  
  // CREATE
  async store(req, res) {
    try {
      const { nome, povo, fonte } = req.body;
      const { filename, mimetype } = req.file; // Pega do Multer
      
      // O req.userId vem do middleware de autenticação
      const { userId } = req; 

      const item = await Acervo.create({
        nome,
        povo,
        fonte,
        midia: filename,
        tipo_arquivo: mimetype,
        UsuarioId: userId, // linka o item ao usuário logado
      });

      return res.status(201).json(item);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao criar item no acervo.' });
    }
  },

  // READ listar todos
  async index(req, res) {
    try {
      const itens = await Acervo.findAll({
        // inclui os dados do usuário (o "Enviado por")
        include: { model: Usuario, as: 'usuario', attributes: ['nome', 'username'] }
      });
      return res.json(itens);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao listar itens.' });
    }
  },

  // READ listar um
  async show(req, res) {
    try {
      const { id } = req.params;
      const item = await Acervo.findByPk(id, {
        include: { model: Usuario, as: 'usuario', attributes: ['nome', 'username'] }
      });

      if (!item) {
        return res.status(404).json({ error: 'Item não encontrado.' });
      }
      return res.json(item);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar item.' });
    }
  },

  // UPDATE (
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, povo, fonte } = req.body;
      const { userId } = req; // ID do usuário logado

      const item = await Acervo.findByPk(id);
      if (!item) {
        return res.status(404).json({ error: 'Item não encontrado.' });
      }

      // verifica se o usuário logado é o dono do item
      if (item.UsuarioId !== userId) {
        return res.status(401).json({ error: 'Não autorizado: Você não é o dono deste item.' });
      }

      let midiaAntiga = item.midia; // salva o nome do arquivo antigo
      let arquivoFoiAtualizado = false;

      // verifica se um NOVO arquivo foi enviado na requisição
      if (req.file) {
        item.midia = req.file.filename;
        item.tipo_arquivo = req.file.mimetype;
        arquivoFoiAtualizado = true;
      }
      
      item.nome = nome || item.nome;
      item.povo = povo || item.povo;
      item.fonte = fonte || item.fonte;
      
      await item.save(); // salva as novas informações no DB

      // deleta o arquivo antigo (SE UM NOVO FOI ENVIADO)
      if (arquivoFoiAtualizado && midiaAntiga) {
        try {
          const oldFilePath = path.resolve(__dirname, '..', '..', 'uploads', midiaAntiga);
          fs.unlinkSync(oldFilePath); // deleta o arquivo antigo do disco
        } catch (fsErr) {
          console.warn(`Falha ao deletar arquivo antigo: ${midiaAntiga}`, fsErr);
        }
      }

      return res.json(item);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao atualizar item.' });
    }
  },

  // DELETE 
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req; // ID do usuário logado

      const item = await Acervo.findByPk(id);
      if (!item) {
        return res.status(404).json({ error: 'Item não encontrado.' });
      }

      // verifica se o usuário logado é o dono do item
      if (item.UsuarioId !== userId) {
        return res.status(401).json({ error: 'Não autorizado: Você não é o dono deste item.' });
      }

      const midiaParaDeletar = item.midia; // pega o nome do arquivo
      
      // deleta do banco de dados
      await item.destroy();

      // deleta o arquivo da pasta 'uploads'
      if (midiaParaDeletar) {
        try {
          const filePath = path.resolve(__dirname, '..', '..', 'uploads', midiaParaDeletar);
          fs.unlinkSync(filePath); // deleta o arquivo do disco
        } catch (fsErr) {
          // Se o arquivo não existir, só avisa no console, mas não dá erro 500
          console.warn(`Falha ao deletar arquivo: ${midiaParaDeletar}`, fsErr);
        }
      }

      return res.status(204).send(); 

    } catch (err) {
      console.error("Erro no 'destroy' do AcervoController:", err);
      return res.status(500).json({ error: 'Erro ao deletar item.' });
    }
  }
};