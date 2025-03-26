*/`GSMARENA`
Weem :
API : https://fastrestapis.fasturl.cloud/
Weem :
https://whatsapp.com/channel/0029Vb9ZfML6GcGFm9aPgh0W
&
https://whatsapp.com/channel/0029VasQWtS4NVig014W6v17
/*

let fetch = require('node-fetch');

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) throw `*🚩 Contoh:* ${usedPrefix + command} iPhone 12`;  
  let teks = '';
  
  try {
    const api = await fetch(`https://fastrestapis.fasturl.cloud/search/gsmarena/advanced?query=${encodeURIComponent(text)}`);
    let json = await api.json();
    
    if (json.status !== 200) throw `🚩 *Gagal Memuat Data!*`;

    let result = json.result;
    let specs = result.specs;

    teks += `*${result.name}*\n\n`;
    teks += `📅 *Rilis:* ${result.releaseDate}\n`;
    teks += `⚖ *Berat:* ${result.weight}\n`;
    teks += `📱 *OS:* ${result.os}\n`;
    teks += `💾 *Storage:* ${result.storage}\n`;
    teks += `🖥 *Layar:* ${result.displaySize} - ${result.displayResolution}\n`;
    teks += `📷 *Kamera:* ${result.camera} MP (Video: ${result.video})\n`;
    teks += `🎮 *Chipset:* ${result.chipset}\n`;
    teks += `⚡ *Baterai:* ${result.battery} mAh (Charging: ${result.charging})\n\n`;

    teks += '*📡 Network*\n';
    teks += `- Technology: ${specs.Network.Technology}\n`;
    teks += `- 2G Bands: ${specs.Network["2G bands"]}\n`;
    teks += `- 3G Bands: ${specs.Network["3G bands"]}\n`;
    teks += `- 4G Bands: ${specs.Network["4G bands"]}\n`;
    teks += `- 5G Bands: ${specs.Network["5G bands"]}\n`;
    teks += `- Speed: ${specs.Network.Speed}\n\n`;

    teks += '*📦 Body*\n';
    teks += `- Dimensions: ${specs.Body.Dimensions}\n`;
    teks += `- Weight: ${specs.Body.Weight}\n`;
    teks += `- Build: ${specs.Body.Build}\n`;
    teks += `- SIM: ${specs.Body.SIM}\n\n`;

    teks += '*🔧 Platform*\n';
    teks += `- OS: ${specs.Platform.OS}\n`;
    teks += `- Chipset: ${specs.Platform.Chipset}\n`;
    teks += `- CPU: ${specs.Platform.CPU}\n`;
    teks += `- GPU: ${specs.Platform.GPU}\n\n`;

    teks += '*🔋 Battery*\n';
    teks += `- Type: ${specs.Battery.Type}\n`;
    teks += `- Charging: ${specs.Battery.Charging}\n\n`;

    teks += '*🎨 Warna*\n';
    teks += `${specs.Misc.Colors}\n\n`;

    teks += `🌐 *Sumber:* [GSM Arena](${json.result.url})\n\n`;
    teks += `🖼 *Preview:* ${json.result.imageUrl}\n`;

    await conn.relayMessage(m.chat, {
      extendedTextMessage: {
        text: teks,
        contextInfo: {
          externalAdReply: {
            title: 'DEVICE INFORMATION',
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnailUrl: json.result.imageUrl,
            sourceUrl: json.result.url
          }
        },
        mentions: [m.sender]
      }
    }, {});
  } catch (e) {
    console.error(e);
    throw `🚩 *Gagal Memuat Data!*`;
  }
};

handler.command = handler.help = ['gsmarena'];
handler.tags = ['internet'];
handler.limit = true;

module.exports = handler;