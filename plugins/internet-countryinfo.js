const fetch = require('node-fetch');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Contoh penggunaan: ${usedPrefix}${command} Indonesia`;

    try {
        // Panggil API dengan nama negara sebagai parameter
        const response = await fetch(`https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(args[0])}`);
        const json = await response.json();

        // Periksa apakah API berhasil memberikan data
        if (!json.status || !json.data) throw 'Data tidak ditemukan atau terjadi kesalahan pada API.';

        // Ambil data dari respon API
        const {
            name,
            capital,
            flag,
            phoneCode,
            googleMapsLink,
            continent,
            coordinates,
            area,
            landlocked,
            languages,
            famousFor,
            constitutionalForm,
            neighbors,
            currency,
            drivingSide,
            alcoholProhibition,
            internetTLD,
            isoCode,
        } = json.data;

        // Format pesan
        let text = `
🌍 *Informasi Negara: ${name}* 🌍

🏛️ *Ibu Kota*: ${capital}
📞 *Kode Telepon*: ${phoneCode}
🗺️ *Peta Google*: [Lihat Peta](${googleMapsLink})
🌏 *Benua*: ${continent.name} ${continent.emoji}
📍 *Koordinat*: ${coordinates.latitude}, ${coordinates.longitude}
🌐 *Luas*: ${area.squareKilometers} km² (${area.squareMiles} mil²)
🚗 *Sisi Mengemudi*: ${drivingSide === 'left' ? 'Kiri' : 'Kanan'}
🍺 *Larangan Alkohol*: ${alcoholProhibition}
💬 *Bahasa*: ${languages.native.join(', ')}
💰 *Mata Uang*: ${currency}
🏴‍☠️ *Domain Internet*: ${internetTLD}
🔢 *Kode ISO*: Numeric: ${isoCode.numeric}, Alpha2: ${isoCode.alpha2}, Alpha3: ${isoCode.alpha3}
🎖️ *Terkenal Untuk*: ${famousFor}
⚖️ *Bentuk Konstitusi*: ${constitutionalForm}
🚩 *Terjebak Daratan*: ${landlocked ? 'Ya' : 'Tidak'}

🤝 *Negara Tetangga*:
${neighbors.map(n => `- ${n.name} (${n.coordinates.latitude}, ${n.coordinates.longitude})`).join('\n')}

🖼️ *Bendera*:
`.trim();

        // Kirim pesan dengan gambar bendera sebagai thumbnail
        await conn.sendMessage(m.chat, {
            image: { url: flag },
            caption: text,
        }, { quoted: m });
    } catch (e) {
        console.error(e);
        m.reply('Terjadi kesalahan atau data negara tidak ditemukan.');
    }
};

handler.help = ['countryinfo <nama negara>'];
handler.tags = ['tools','internet'];
handler.command = /^(cti|countryinfo|info(?:negara)?)$/i;

module.exports = handler;