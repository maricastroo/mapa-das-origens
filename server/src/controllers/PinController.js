// server/src/controllers/PinController.js
const Pin = require('../models/Pin');

module.exports = {
  async store(req, res) {
    //Pega os dados de TEXTO do req.body
    const { nome, descricao, latitude, longitude } = req.body;
    
    //VERIFICA se um arquivo foi enviado.
    // Se req.file existir, pegue o filename.
    // Se não existir, 'midia' será nulo.
    const midia = req.file ? req.file.filename : null;

    try {
      // Cria o Pin no banco
      const pin = await Pin.create({
        nome,
        descricao,
        latitude,
        longitude,
        midia: midia,
      });

      return res.json(pin);

    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: 'Erro ao salvar o pin.' });
    }
  }
};