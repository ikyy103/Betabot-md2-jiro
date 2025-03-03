const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');
const { exec } = require('child_process');

let handler = async (m, { args, conn }) => {
    if (args.length < 1) {
        return m.reply("⚠️ *Contoh:* .screenrecord https://google.com, pc, 5, 10, 60");
    }

    let [url, device = "pc", delay = "0", time = "5", fps = "30"] = args.join(" ").split(",").map(e => e.trim());

    if (!url.startsWith("http")) return m.reply("⚠️ URL tidak valid! Pastikan dimulai dengan http atau https.");

    let validDevices = ["mobile", "pc", "tablet"];
    if (!validDevices.includes(device)) return m.reply("⚠️ Perangkat tidak valid! Gunakan: mobile, pc, atau tablet.");
    
    delay = Math.min(Math.max(parseInt(delay), 0), 60); // Maksimal 60 detik
    time = Math.min(Math.max(parseInt(time), 1), 30); // Maksimal 30 detik
    fps = Math.min(Math.max(parseInt(fps), 1), 120); // Maksimal 120 FPS

    m.reply("🔄 *Sedang merekam tampilan website... Harap tunggu.*");

    try {
        let { data, headers } = await axios.get("https://fastrestapis.fasturl.cloud/tool/screenrecord", {
            params: { url, device, delay, time, fps },
            responseType: "arraybuffer",
        });

        let contentType = headers['content-type'] || '';
        if (!contentType.includes('video/mp4')) {
            return m.reply("⚠️ API tidak mengembalikan video yang valid. Coba lagi nanti.");
        }

        let tempFilePath = path.join(process.cwd(), `temp/screenrecord_${Date.now()}.mp4`);
        let finalFilePath = path.join(process.cwd(), `screenrecord_${Date.now()}.mp4`);
        await fs.writeFile(tempFilePath, data);

        let fileSize = (await fs.stat(tempFilePath)).size;
        if (fileSize < 100000) {
            await fs.unlink(tempFilePath);
            return m.reply("⚠️ Video terlalu kecil atau tidak valid! Coba rekam ulang dengan durasi lebih panjang.");
        }

        // Perbaiki video dengan ffmpeg sebelum dikirim
        await new Promise((resolve, reject) => {
            exec(`ffmpeg -i ${tempFilePath} -c:v libx264 -preset slow -crf 23 -c:a aac -b:a 128k ${finalFilePath}`, (error) => {
                if (error) reject(error);
                resolve();
            });
        });

        m.reply("✅ *Rekaman selesai! Mengirim video...*");
        await conn.sendMessage(m.chat, { 
            video: { url: finalFilePath }, 
            mimetype: 'video/mp4',
            caption: `📹 *Rekaman Layar dari:* ${url}\n🖥 *Perangkat:* ${device}\n⏳ *Durasi:* ${time}s\n🎥 *FPS:* ${fps}`
        });

        setTimeout(() => {
            fs.unlink(tempFilePath);
            fs.unlink(finalFilePath);
        }, 5000);
    } catch (error) {
        console.error("❌ Error Screen Record:", error);
        m.reply("⚠️ Terjadi kesalahan saat merekam layar. Coba lagi nanti.");
    }
};

handler.help = ["screenrecord <url>"];
handler.tags = ["tools"];
handler.command = /^screenrecord|scrnrcd$/i;
handler.owner = false;
handler.limit = 3;

module.exports = handler;