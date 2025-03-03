let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Masukan teks pencarian`);

    try {
        const response = (await axios.get("https://api.vreden.web.id/api/instagram/users?query=" + text)).data;
        let teks = "*IG SEARCH USERS*\n\n";
        
        for (let i of response.result.users) {
            teks += `ID : ${i.id}\nNickname : ${i.full_name}\nUsername : ${i.username}\nTerverifikasi : ${i.is_verified ? "Yes" : "No"}\nPrivate Akun : ${i.is_private ? "Yes" : "No"}\n\n`;
        }
        
        sock.sendMessage(m.chat, { 
            image: { url: response.result.users[0].profile_pic_url }, 
            caption: teks 
        }, { quoted: m });
    } catch (error) {
        await m.reply("Terjadi kesalahan");
    }
};

handler.help = ['instauser <username>'];
handler.tags = ['internet'];
handler.command = /^(instauser)$/i;
handler.limit = true;

module.exports = handler;