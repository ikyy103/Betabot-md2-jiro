const fs = require("fs");
const fetch = require("node-fetch");

let handler = async (m, { args }) => {
    if (!args[0]) return m.reply("⚠️ Masukkan link raw file yang ingin diupdate!");

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

            let fileName = path.split("/").pop().replace(".js", "");
            let splitCommand = fileName.split("-");
            if (splitCommand.length < 2) throw new Error("⚠️ Format nama file salah! Gunakan format kategori-command.js");

            let category = splitCommand[0]; 
            let commandName = splitCommand.slice(1).join("-");

            let infoOptions = ["new", "update"];
            let info = infoOptions[Math.floor(Math.random() * infoOptions.length)];

            updatedFiles.push(`𝗖𝗼𝗺𝗺𝗮𝗻𝗱 : *${commandName}*\n𝗧𝗮𝗴𝘀 : *${category}*\n𝗜𝗻𝗳𝗼 : *${info}*\n`);
        } catch (err) {
            updatedFiles.push(`❌ Error: ${err.message}`);
        }
    };

    await Promise.all(args.map(updateFile));

    m.reply(`🔄 *UPDATE SELESAI!*\n\n${updatedFiles.join("\n")}\n⏳ Restarting bot...`);

    setTimeout(() => {
        process.exit(1);
    }, 3000);
};

handler.command = /^(update)$/i;
handler.owner = true;

module.exports = handler;