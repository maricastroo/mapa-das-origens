// server/src/controllers/UsuarioController.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

module.exports = {
  
  // CREATE
  async store(req, res) {
    // Pega os dados corretos do body
    const { nome, username, email, senha } = req.body;
    try {
      // Verifica se o USERNAME já existe (Esta é a primeira checagem)
      const usernameExistente = await Usuario.findOne({ where: { username } });
      if (usernameExistente) {
        return res.status(400).json({ error: 'Este @usuário já está em uso.' });
      }

      // Verifica se o EMAIL já existe
      const emailExistente = await Usuario.findOne({ where: { email } });
      if (emailExistente) {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }

      // Criptografa a senha
      const password_hash = await bcrypt.hash(senha, 8);

      // Cria o usuário no banco
      const usuario = await Usuario.create({
        nome,
        username,
        email,
        password_hash,
      });

      return res.status(201).json(usuario); 

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
  },

  // LISTAR TODOS
  async index(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      return res.json(usuarios);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao listar usuários.' });
    }
  },

  // MOSTRAR UM
  async show(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
      return res.json(usuario);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
  },

  // UPDATE
  async update(req, res) {
    try {
      const { id } = req.params; 
      const { nome, username, email, senha, senhaAntiga } = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      // Lógica de Email
      if (email && email !== usuario.email) {
        const emailExistente = await Usuario.findOne({ where: { email } });
        if (emailExistente) {
          return res.status(400).json({ error: 'Este e-mail já está em uso.' });
        }
      }

      // Lógica de Username
      if (username && username !== usuario.username) {
        const usernameExistente = await Usuario.findOne({ where: { username } });
        if (usernameExistente) {
          return res.status(400).json({ error: 'Este @usuário já está em uso.' });
        }
      }

      // Lógica de Senha
      if (senha) {
        if (!senhaAntiga) {
          return res.status(401).json({ error: 'Para alterar a senha, é obrigatório informar a senha antiga.' });
        }
        const senhaCorreta = await bcrypt.compare(senhaAntiga, usuario.password_hash);
        if (!senhaCorreta) {
          return res.status(401).json({ error: 'A senha antiga está incorreta.' });
        }
        usuario.password_hash = await bcrypt.hash(senha, 8);
      }

      // Salva as alterações
      usuario.nome = nome || usuario.nome;
      usuario.email = email || usuario.email;
      usuario.username = username || usuario.username; 

      await usuario.save();
      return res.json(usuario);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
  },

  // DELETE
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
      await usuario.destroy();
      return res.status(204).send();

    } catch (err) {
      return res.status(500).json({ error: 'Erro ao deletar usuário.' });
    }
  }
};