global.owner = ['6281547205987'];
global.mods = ['6281547205987'];
global.prems = ['6281547205987'];

global.nameowner = 'Zephyr';
global.numberowner = '6281547205987';
global.mail = 'satriahubdeals@gmail.com';
global.gc = 'https://chat.whatsapp.com/DkTQfKV6sza2W503p1sOMx';
global.instagram = 'https://instagram.com/satriaonly2024';
global.wm = '© Jiro';
global.wait = '_*Tunggu sedang di proses...*_';
global.eror = '_*Server Error*_';
global.stiker_wait = '*⫹⫺ Stiker sedang dibuat...*';
global.packname = 'Made With';
global.author = 'Bot WhatsApp';
global.maxwarn = '2'; // Peringatan maksimum
global.antiporn = true; // Auto delete pesan porno (bot harus admin)

// INI WAJIB DI ISI! //
global.lann = 'isi_apikey'; 
// Daftar terlebih dahulu di https://api.betabotz.eu.org

// INI OPTIONAL BOLEH DI ISI BOLEH JUGA ENGGA //
global.btc = 'isi_apikey';
// Daftar di https://api.botcahx.eu.org 

// Ini bebas isi apa ga //
global.maelyn = 'isi_apikey';
// Daftar di https://api.maelyn.tech

// ini bebas mau di isi apa ga //
global.fastrestapis = 'isi_apikey';


global.APIs = {   
  lann: 'https://api.betabotz.eu.org',
  btc: 'https://api.botcahx.eu.org',
  maelyn: 'https://api.maelyn.tech',
  fastrestapis: 'https://fastrestapis.fasturl.cloud'
};

global.APIKeys = { 
  'https://api.betabotz.eu.org': global.lann, 
  'https://api.botcahx.eu.org': global.btc,
  'https://api.maelyn.tech': global.maelyn,
  'https://fastrestapis.fasturl.cloud': global.fastrestapis
};

let fs = require('fs');
let chalk = require('chalk');
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  delete require.cache[file];
  require(file);
});