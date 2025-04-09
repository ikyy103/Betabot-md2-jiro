let autoclosegc = db.data.settings.autoclosegc = db.data.settings.autoclosegc || { status: false }

let handler = async (m, { command }) => {
  if (command === 'autoclosegc_on') {
    autoclosegc.status = true
    m.reply('Fitur *Auto Close Group* telah diaktifkan.')
  } else if (command === 'autoclosegc_off') {
    autoclosegc.status = false
    m.reply('Fitur *Auto Close Group* telah dinonaktifkan.')
  }
}

handler.help = ['autoclosegc_on', 'autoclosegc_off']
handler.tags = ['group']
handler.command = /^autoclosegc_(on|off)$/i
handler.admin = true;
handler.botAdmin = true;

module.exports = handler