/*
[ ALARAM ]

Type : Plugin CJS

Sumber : https://whatsapp.com/channel/0029VabNTKm35fLp0YzUmH03

*/

let clockstring = '08:00' 
let isAlarmActive = false 


function playAlarm() {

  console.log('Alarm berbunyi!')
}

function setAlarmTime(time) {
  clockstring = time
  console.log(`Jam alarm berhasil diatur menjadi ${clockstring}`)
}


function turnOffAlarm() {
  clockstring = null
  console.log('Alarm berhasil dimatikan')
}

let handler = async (m, { conn, args }) => {
  let command = args[0] 

  if (command === 'atur') {
    let time = args[1] 
    setAlarmTime(time)
    isAlarmActive = true
    conn.reply(m.chat, `Jam alarm berhasil diatur menjadi ${clockstring}`, m)
  } else if (command === 'matikan') {
    turnOffAlarm()
    isAlarmActive = false
    conn.reply(m.chat, `Alarm berhasil dimatikan`, m)
  } else {
    conn.reply(m.chat, `Pilihan yang tersedia: atur, matikan`, m)
  }

  if (isAlarmActive && new Date().toLocaleTimeString() === clockstring) {
    playAlarm()
  }
}

handler.help = ['dering']
handler.tags = ['main']
handler.command = /^(dering)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = false
handler.private = false
handler.limit = true
handler.admin = false
handler.botadmin = false

handler.fail = null

module.exports = handler