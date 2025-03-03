let handler = async (m, { conn, args, text }) => {
    if (!text) throw `Silakan masukkan pertanyaan yang ingin diajukan.`;

    const apiUrl = `https://fastrestapis.fasturl.cloud/aillm/muslim?ask=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 200) {
            m.reply(data.result);
        } else {
            m.reply(`Terjadi kesalahan: ${data.content}`);
        }
    } catch (error) {
        m.reply(`Gagal menghubungi API: ${error.message}`);
    }
};

handler.help = ['aimuslim <pertanyaan>','muslimai <pertanyaan>'];
handler.tags = ['ai','internet'];
handler.command = /^aimuslim|muslimai)$/i;
handler.limit = true;

module.exports = handler;