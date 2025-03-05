const fs = require("fs");
const fetch = require("node-fetch");

let handler = async (m, { args }) => {

    if (!args[0]) return m.reply("⚠️ Masukin link raw file yang mau diupdate!");
    
    let updatedFiles = [];

    const updateFile = async (url) => {
        try {
            let splitUrl = url.split("/main/");
            if (splitUrl.length < 2) throw new Error("⚠️ Format URL salah! Pastikan link raw GitHub.");

            let path = splitUrl[1];
            if (!path) throw new Error("⚠️ Path file tidak ditemukan dalam URL!");

            let res = await fetch(url);
            if (!res.ok) throw new Error("⚠️ Gagal mengambil file! Periksa link raw GitHub.");

            let fileData = await res.text();
            fs.writeFileSync(`./${path}`, fileData);
            updatedFiles.push(`🗃️ Updated: ./${path}`);
        } catch (err) {
            updatedFiles.push(`❌ Error: ${err.message}`);
        }
    };

    await Promise.all(args.map(updateFile));

    m.reply(`🔄 **UPDATE SELESAI!**\n\n${updatedFiles.join("\n")}\n\n⏳ Restarting bot...`);

    setTimeout(() => {
        process.exit(1);
    }, 3000);
};

handler.command = /^(update)$/i;
handler.owner = true;

module.exports = handler;