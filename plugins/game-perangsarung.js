handler = async (m, { conn, text, participants }) => {
    let taggedUsers = m.mentionedJid.slice(0, 7); // Maksimal 7 pemain
    if (taggedUsers.length < 7) return conn.reply(m.chat, `Tag 7 orang untuk bermain perang sarung!`, m);

    let name = conn.getName(m.sender);
    let players = taggedUsers.map(jid => ({
        jid,
        name: conn.getName(jid)
    }));

    function randomEliminate() {
        let index = Math.floor(Math.random() * players.length);
        return players.splice(index, 1)[0]; // Ambil & hapus dari daftar
    }

    let gameText = `⚔️ **Game Perang Sarung Dimulai!** ⚔️\nPeserta:\n${players.map(p => `- @${p.jid.split('@')[0]}`).join('\n')}`;
    conn.reply(m.chat, gameText, m, { mentions: taggedUsers });

    setTimeout(() => {
        if (players.length > 0) {
            conn.reply(m.chat, `🔥 **Ronde 1**: ${randomEliminate().name} telah mati! ☠️`, m);
        }
    }, 5000);
    setTimeout(() => {
        if (players.length > 0) {
            conn.reply(m.chat, `🔥 **Ronde 2**: ${randomEliminate().name} telah mati! ☠️`, m);
        }
    }, 10000);
    setTimeout(() => {
        if (players.length > 0) {
            conn.reply(m.chat, `🔥 **Ronde 3**: ${randomEliminate().name} telah mati! ☠️`, m);
        }
    }, 15000);
    setTimeout(() => {
        if (players.length > 0) {
            conn.reply(m.chat, `🔥 **Ronde 4**: ${randomEliminate().name} telah mati! ☠️`, m);
        }
    }, 20000);
    setTimeout(() => {
        if (players.length > 0) {
            conn.reply(m.chat, `🔥 **Ronde 5**: ${randomEliminate().name} telah mati! ☠️`, m);
        }
    }, 25000);

    setTimeout(() => {
        if (players.length === 0) return; // Jika tidak ada pemain tersisa

        let juara3 = randomEliminate();
        let juara2 = randomEliminate();
        let juara1 = players[0]; // Pemenang terakhir

        let resultText = `🏆 **Hasil Akhir Perang Sarung!** 🏆\n\n🥇 **Juara 1:** ${juara1.name}\n🥈 **Juara 2:** ${juara2.name}\n🥉 **Juara 3:** ${juara3.name}\n\nTerima kasih sudah bermain!`;
        conn.reply(m.chat, resultText, m);
    }, 30000);
}

handler.help = ['perangsarung @tag'];
handler.tags = ['game'];
handler.command = /^(perangsarung)$/i;
handler.group = true;
handler.register = true;

module.exports = handler;

/*
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/