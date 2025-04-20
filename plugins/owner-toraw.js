const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

let handler = async (m, { args }) => {
    if (!args[0]) return m.reply('⚠️ Masukkan link GitHub!\nContoh: .githubtoraw https://github.com/user/repo/blob/main/plugins/fitur-baru.js');

    try {
        let input = args[0];
        if (!input.includes('github.com') || !input.includes('/blob/')) {
            return m.reply('⚠️ Link GitHub harus mengandung `/blob/` agar bisa dikonversi ke raw!');
        }

        // Ubah link GitHub ke raw
        let rawUrl = input
            .replace('https://github.com/', 'https://raw.githubusercontent.com/')
            .replace('/blob/', '/');

        // Dapatkan nama file dari URL
        let fileName = path.basename(rawUrl);
        // Ambil ekstensi file
        let fileExtension = path.extname(fileName).toLowerCase();

        // Cek apakah file memiliki ekstensi yang valid
        const validExtensions = ['.js', '.json', '.txt', '.md', '.css', '.html', '.xml']; // Tambahkan ekstensi lain sesuai kebutuhan
        if (!validExtensions.includes(fileExtension)) {
            return m.reply(`⚠️ File harus berekstensi salah satu dari: ${validExtensions.join(', ')}`);
        }

        let res = await fetch(rawUrl);
        if (!res.ok) throw '❌ Gagal mengambil isi file dari raw GitHub!';
        let content = await res.text();

        // Simpan sementara untuk dikirim
        let tempPath = `temp_${Date.now()}_${fileName}`;
        fs.writeFileSync(tempPath, content);

        await m.reply(`✅ *File berhasil diambil dari GitHub!*\n\n🌐 *Raw URL:* ${rawUrl}`);
        await conn.sendMessage(m.chat, { document: { url: tempPath }, mimetype: `text/${fileExtension.slice(1)}`, fileName }, { quoted: m });

        // Hapus file setelah dikirim
        setTimeout(() => {
            fs.unlinkSync(tempPath);
        }, 10 * 1000); // hapus setelah 10 detik

    } catch (e) {
        console.error(e);
        m.reply('❌ Terjadi kesalahan saat memproses file!');
    }
};

handler.command = /^(githubtoraw|gtoraw|toraw)$/i;
handler.help = ['toraw <link>'];
handler.tags = ['owner'];
handler.owner = false;

module.exports = handler;