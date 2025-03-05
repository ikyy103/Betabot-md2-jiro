const axios = require('axios');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        const githubToken = `YOUR_GITHUB_TOKEN`; // Token GitHub (buat di https://github.com/settings/tokens)
        const owner = 'YOUR_GITHUB_USERNAME'; // Nama pemilik repository
        const repo = 'YOUR_REPOSITORY_NAME'; // Nama repository tanpa URL
        const branch = 'main'; // Branch repository (default 'main')
        
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';

        if (!mime) {
            return m.reply(`❌ *Silakan reply file yang ingin diupload!*\n\n📌 *Contoh:* _Balas gambar lalu ketik_\n\`${usedPrefix + command} plugins\``);
        }

        let media = await q.download();
        let fileExtension = mime.split('/')[1];
        let fileName = q.fileName ? q.fileName : `${Date.now()}.${fileExtension}`;

        let uploadFolder = args[0] ? args[0] : 'uploads'; 
        let filePath = `${uploadFolder}/${fileName}`;

        let fileExists = false;
        let sha = null;

        try {
            let checkFile = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
                headers: { Authorization: `Bearer ${githubToken}` },
            });

            if (checkFile.data && checkFile.data.sha) {
                fileExists = true;
                sha = checkFile.data.sha;
            }
        } catch (err) {
        }

        let fileContent = Buffer.from(media).toString('base64');
        let uploadData = {
            message: fileExists ? `Replace file ${fileName}` : `Upload file ${fileName}`,
            content: fileContent,
            branch: branch,
        };

        if (fileExists) {
            uploadData.sha = sha;
        }

        let response = await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, uploadData, {
            headers: {
                Authorization: `Bearer ${githubToken}`,
                'Content-Type': 'application/json',
            },
        });
        let rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;

        await conn.sendMessage(m.chat, { text: `✅ *File berhasil diupload ke GitHub!*\n\n📂 *Nama:* ${fileName}\n📁 *Folder:* ${uploadFolder}\n🌐 *Raw URL:* ${rawUrl}` }, { quoted: m });

    } catch (e) {
        console.error(e);
        return m.reply(`❌ *Error:* ${e.message}`);
    }
};

handler.command = /^(uploadgh|upgh)$/i;
handler.tags = ['tools'];
handler.owner = true;

module.exports = handler;