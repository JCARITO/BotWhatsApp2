const { Client } = require('whatsapp-web.js');
const client = new Client();
const qrcode = require('qrcode-terminal');
// const nodemailer = require('nodemailer');//npm install nodemailer
// const readline = require('readline');



async function run() {
  client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('Bien! WhatsApp conectado.');
  });

  await client.initialize();


  
function cumprimentar() {
  const dataAtual = new Date();
  const hora = dataAtual.getHours();

  let saudacao;

  if (hora >= 6 && hora < 12) {
    saudacao = "Buen dia!";
  } else if (hora >= 12 && hora < 17) {
    saudacao = "Buena tarde!";
  } else {
    saudacao = "Buena noche!";
  }

  return saudacao;
}

let menuactivo = false;
let userState = {};

  const delay = ms => new Promise(res => setTimeout(res, ms));

  client.on('message', async msg => {
   
    const userNumber = msg.from;

    if (msg.body === "Hola" && !menuactivo) {
        menuactivo = true;
        userState[userNumber] = { step: 1 };
        sendMessage(userNumber, 'Seleccione una opcion: \n\n 1. Recibir saludo\n 2. Ingresar dato del usuario');
    } else if (menuactivo) {
        handleUserInput(msg.body, userNumber);
    }
});

function sendMessage(userNumber, message) {
    client.sendMessage(userNumber, message);
}

function handleUserInput(input, userNumber) {
    let state = userState[userNumber];

    if (!state) {
        state = { step: 1 };
        userState[userNumber] = state;
    }

    switch (state.step) {
        case 1:
            if (input === '1') {
                sendMessage(userNumber, cumprimentar());
                delete userState[userNumber];
            } else if (input === '2') {
                sendMessage(userNumber, 'Ingrese su número de cedula:');
                state.step = 2;
            } else {
                sendMessage(userNumber, 'Opcion invalida');
                delete userState[userNumber];
            }
            break;

        case 2:
            const userNumberInput = parseInt(input);
            if (!isNaN(userNumberInput)) {
              sendMessage(userNumber, `El número de cedula: ${userNumberInput} fue registrado correctamente en nuestra base de datos.`);
            } else {
                sendMessage(userNumber, 'Entrada no válida. Ingrese su número de cedula.');
                state.step = 2;
            }
            delete userState[userNumber];
            break;

        default:
            sendMessage(userNumber, 'Opción no válida');
            delete userState[userNumber];
            break;
    }
}
  
  // function waitForResponse() {
  //   return new Promise((resolve, reject) => {
  //     client.on('message', async msg => {
  //       if (msg.from.endsWith('@c.us')) {
  //         resolve(msg);
  //       }
  //     });
  //   });
  // }
}  
run().catch(err => console.error(err));