// aqui o CRUD completo para o modelo Usuario
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
      }

      // Encontra o usuário pelo email
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      // Compara a senha digitada com o hash salvo no banco (usando o campo 'password_hash')
      const isMatch = await bcrypt.compare(senha, usuario.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      // Se deu certo, cria o token
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, username: usuario.username }, // Dados do token
        process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO', // (Mude isso para seu .env)
        { expiresIn: '1h' } 
      );

      // Envia a resposta
      return res.status(200).json({ 
        message: 'Login bem-sucedido!',
        token: token,
        user: { id: usuario.id, nome: usuario.nome, email: usuario.email, username: usuario.username }
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro no servidor durante o login.' });
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