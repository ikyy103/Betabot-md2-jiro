global.owner = ['6281547205987']  
global.mods = ['6281547205987'] 
global.prems = ['6281547205987']
global.nameowner = 'Zephyr'
global.numberowner = '6281547205987'
global.mail = 'satriahubdeals@gmail.com' 
global.gc = 'https://chat.whatsapp.com/CSmZAL8efZy4ijCWedJVX9'
global.saluran = 'https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w'
global.instagram = 'https://instagram.com/satriaonly2024'
global.wm = '© Jiro'
global.wait = '_*Tunggu sedang di proses...*_'
global.eror = '_*Server Error*_'
global.stiker_wait = '*⫹⫺ Stiker sedang dibuat...*'
global.packname = 'Made With'
global.author = 'Bot Zephyr'
global.maxwarn = '2' // Peringatan maksimum
global.antiporn = true // Auto delete pesan porno (bot harus admin)
// untuk payment 
global.dana = '089525720818'
global.gopay = '081547205987'
global.shopee = '081547205987'
global.ovo = '081547205987'
global.qris = 'https://cloudkuimages.com/uploads/images/67f25e4ae348e.jpg'
//INI WAJIB DI ISI!//
global.lann = 'beta-Satriaop' 
//Daftar terlebih dahulu https://api.betabotz.eu.org

//INI OPTIONAL BOLEH DI ISI BOLEH JUGA ENGGA//
global.btc = 'c8583b20'
//Daftar https://api.botcahx.eu.org 

global.APIs = {   
  lann: 'https://api.betabotz.eu.org',
  btc: 'https://api.botcahx.eu.org'
}
global.APIKeys = { 
  'https://api.betabotz.eu.org': global.lann, 
  'https://api.botcahx.eu.org': global.btc
}

global.link = {
  instagram: "-",
  github: "-",
  group: "https://chat.whatsapp.com/CSmZAL8efZy4ijCWedJVX9",
  website: "-",
saluran:"https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w",
 youtube: "youtube.com/@SatriaHubDeals"
    }

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})