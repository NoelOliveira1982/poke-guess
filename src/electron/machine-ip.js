import os from 'os';

// Função para obter o IP da máquina
const getIPAddress = () => {
  const interfaces = os.networkInterfaces();
  let ipAddress = '';

  for (const interfaceKey in interfaces) {
    const iface = interfaces[interfaceKey];
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        ipAddress = alias.address; // Pega o primeiro IP não interno
        break;
      }
    }
  }

  return ipAddress;
};

const userIP = getIPAddress();

export { userIP };
