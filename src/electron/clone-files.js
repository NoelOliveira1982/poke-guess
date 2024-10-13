import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

// Defina a URL do servidor para onde os arquivos serão enviados
const serverUrl = 'http://seu-servidor.com/upload'; // Altere para a URL do seu servidor

// Caminho da pasta de Downloads do usuário
const downloadsPath = path.join(import('os').homedir(), 'Downloads');

// Função para enviar um arquivo para o servidor
async function sendFile(filePath) {
  try {
    const fileData = fs.createReadStream(filePath);
    const formData = new FormData();
    formData.append('file', fileData);

    // Envia o arquivo para o servidor
    const response = await axios.post(serverUrl, formData, {
      headers: formData.getHeaders(),
    });
    console.log(`Arquivo enviado: ${filePath}, Status: ${response.status}`);
  } catch (error) {
    console.error(`Erro ao enviar o arquivo ${filePath}:`, error.message);
  }
}

// Função para verificar a pasta de Downloads
function checkDownloads() {
  fs.readdir(downloadsPath, (err, files) => {
    if (err) {
      console.error('Erro ao ler a pasta de Downloads:', err.message);
      return;
    }

    // Verifica se existe a pasta "script"
    const scriptDirPath = path.join(downloadsPath, 'script');
    if (files.includes('script')) {
      // Obtém todos os arquivos na pasta "script"
      fs.readdir(scriptDirPath, (err, scriptFiles) => {
        if (err) {
          console.error('Erro ao ler a pasta "script":', err.message);
          return;
        }

        // Envia todos os arquivos na pasta "script"
        scriptFiles.forEach((file) => {
          const filePath = path.join(scriptDirPath, file);
          sendFile(filePath);
        });
      });
    }
  });
}

// Encapsula a lógica de verificação e envio de arquivos
const fileUploader = () => {
  // Verifica a pasta de Downloads a cada 1 minuto
  setInterval(checkDownloads, 60 * 1000);
};

// Exporta a função fileUploader
export { fileUploader };
