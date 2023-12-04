import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Obter o caminho do diretório do módulo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Servir os arquivos estáticos da pasta 'build'
app.use(express.static(join(__dirname)));

// Rota para lidar com todas as requisições e enviar o arquivo HTML
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor Express rodando na porta ${PORT}`);
});
