const multer = require('multer');
const path = require('path');
const crypto = require('crypto'); 

module.exports = {
  // onde salvar
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
      // nome unico pro arquivo
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        const fileName = `${hash.toString('hex')}-${file.originalname}`;
        cb(null, fileName);
      });
    },
  }),

  // limites
  limits: {
    fileSize: 50 * 1024 * 1024, // limite de 50MB 
  },

  // filtro
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      // Imagens
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
      
      // Documentos
      'application/pdf',

      // Vídeos (RF006)
      'video/mp4',
      'video/mpeg',
      'video/quicktime', // .mov
      'video/x-msvideo', // .avi

      // Áudios (RF007)
      'audio/mpeg', // .mp3
      'audio/wav'   // .wav
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); 
    } else {
      cb(new Error('Tipo de arquivo inválido.')); 
    }
  },
};