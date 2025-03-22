let handler = async (m, { conn, args, text }) => {
    let videoUrl = text || (m.quoted && m.quoted.text);

    if (!videoUrl) throw `Silakan masukkan URL video yang ingin diunduh.`;

    try {
        const response = await fetch(`https://api.betabotz.eu.org/api/download/xvideosdl?url=${encodeURIComponent(videoUrl)}&apikey=${lann}`);
        const result = await response.json();

        if (result.status) {
            const { title, url } = result.result;
            let message = `
🎥 Judul: ${title} 
🔗 Link Video: ${url}`;
            m.reply(message); 
        } else { 
            throw `Terjadi kesalahan: ${result.message}`; 
        } 
    } catch (error) { 
        m.reply(`Gagal mengunduh video. Silakan coba lagi nanti. 😢`); 
    } 
};

handler.help = ['xvideodl <url>']; 
handler.tags = ['downloader']; 
handler.command = /^(xvideodl)$/i; 
handler.limit = true;

module.exports = handler;