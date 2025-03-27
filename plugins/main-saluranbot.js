let handler = async (m, { conn }) => {
conn.reply(m.chat, saluran, m) 
}
handler.help = ['saluranbot']
handler.tags = ['main']
handler.command = /^(saluranbot|saluran)$/i

module.exports = handler