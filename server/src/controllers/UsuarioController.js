// logica do CRUD para usuario

const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

module.exports = {
  
  // CREATE 
  async store(req, res) {
    const { nome, email, userName, senha } = req.body;

    try {
      //verifica se o email já existe
      const emailExistente = await Usuario.findOne({ where: { email } });
      if (emailExistente) {
        return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
      }
      const userNameExistente = await Usuario.findOne({ where: { userName } });
      if (userNameExistente) {
        return res.status(400).json({ error: 'Este nome de usuário já está em uso.' });
      }
      // criptografa a senha
      const password_hash = await bcrypt.hash(senha, 8); 
      // cria o usuário no banco
      const usuario = await Usuario.create({
        nome,
        email,
        userName,
        password_hash,
      });

      return res.status(201).json(usuario); // retorna o usuário criado

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
  },

  // READ LISTAR TODOS
  async index(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      return res.json(usuarios);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao listar usuários.' });
    }
  },

  // READ MOSTRAR UM
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
      const { id } = req.params; //id vem da url
      const { nome, userName, email, senha, senhaAntiga } = req.body;

      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      // se caso o email for trocado, verifica se o novo email já existe
      if (email && email !== usuario.email) {
        const emailExistente = await Usuario.findOne({ where: { email } });
        if (emailExistente) {
          return res.status(400).json({ error: 'Este e-mail já está em uso.' });
        }
      }

      if (userName && userName !== usuario.userName) {
        const userNameExistente = await Usuario.findOne({ where: { userName } });
        if (userNameExistente) {
          return res.status(400).json({ error: 'Este nome de usuário já está em uso.' });
        }
      }
      // par senha
      // se o usuario enviou uma senha nova, verificar se a senhaAntiga bate 
      if (senha) {
        if (!senhaAntiga) {
          return res.status(401).json({ error: 'Você precisa informar a senha antiga para alterar a senha.' });
        }
        const senhaCorreta = await bcrypt.compare(senhaAntiga, usuario.password_hash);
        if (!senhaCorreta) {
          return res.status(401).json({ error: 'Senha antiga incorreta.' });
        }
        usuario.password_hash = await bcrypt.hash(senha, 8);

        usuario.nome = nome || usuario.nome; //atualiza nome
        usuario.email = email || usuario.email; //atualiza email
        usuario.userName = userName || usuario.userName; //atualiza userName

        //salva tudo
        await usuario.save();
        return res.json(usuario);
      }
    } catch (err) {
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

      // deleta o usuário do banco
      await usuario.destroy();
      return res.status(204).send();

    } catch (err) {
      return res.status(500).json({ error: 'Erro ao deletar usuário.' });
    }
  }
};