const { 
    generateWAMessageFromContent 
} = require('@adiwajshing/baileys');

process.env.TZ = 'Asia/Jakarta';
let fs = require('fs');
let moment = require('moment-timezone');
let levelling = require('../lib/levelling');

const arrayMenu = [
    'main', 'ai', 'downloader', 'rpg', 'sticker', 'rpgG', 'advanced', 'xp', 
    'fun', 'game', 'github', 'group', 'image', 'nsfw', 'info', 'internet', 
    'islam', 'kerang', 'maker', 'news', 'owner', 'voice', 'quotes', 'stalk', 
    'store', 'shortlink', 'tools', 'anonymous', 'penghasilan', 'anime', 'premium', 
];

const allTags = {
    'main': '★ MENU UTAMA ★',
    'ai': '🤖 MENU AI',
    'downloader': '📥 MENU DOWNLOADER',
    'rpg': '⚔️ MENU RPG',
    'rpgG': '🏰 MENU RPG GUILD',
    'sticker': '🖼️ MENU CONVERT',
    'advanced': '🔧 ADVANCED',
    'xp': '📈 MENU EXP',
    'fun': '🎉 MENU FUN',
    'game': '🎮 MENU GAME',
    'github': '🐱 MENU GITHUB',
    'group': '👥 MENU GROUP',
    'image': '🖌️ MENU IMAGE',
    'nsfw': '🔞 MENU NSFW',
    'info': 'ℹ️ MENU INFO',
    'internet': '🌐 INTERNET',
    'islam': '🕌 MENU ISLAMI',
    'kerang': '🐚 MENU KERANG',
    'maker': '✏️ MENU MAKER',
    'news': '📰 MENU NEWS',
    'owner': '👑 MENU OWNER',
    'voice': '🎙️ PENGUBAH SUARA',
    'quotes': '💬 MENU QUOTES',
    'stalk': '🔍 MENU STALK',
    'store': '🛒 MENU STORE',
    'shortlink': '🔗 SHORT LINK',
    'tools': '🛠️ MENU TOOLS',
    'anonymous': '👻 ANONYMOUS CHAT',
    'penghasilan': '💸 PENGHASILAN',
    'anime': '🦹 ANIME',
     'premium': '🌟PREMIUM'
};

const defaultMenu = {
    before: `
━━━━━━━━━━━━━━━━━━
★ Hi %name! ★
🤖 *Bot Status:* Aktif  
📅 *Tanggal:* %date  
⏰ *Waktu:* %time  
📊 *Uptime:* %uptime  
🚀 *Prefix:* [ %p ]
━━━━━━━━━━━━━━━━━━
*Pilih kategori menu:*
`.trim(),
    header: '┏━⊱ *%category* ⊰━┓',
    body: '┃ © %cmd %islimit %isPremium',
    footer: '┗━━━━━━━━━━━┛',
    after: `\n\n🌟 *Note:* Ketik .menu <kategori> untuk detail menu.\nContoh: .menu tools`,
};

let handler = async (m, { conn, usedPrefix: _p, args }) => {
    try {
        let { exp, level, role } = global.db.data.users[m.sender];
        let name = `@${m.sender.split`@`[0]}`;
        let teks = args[0] || '';

        let d = new Date(new Date + 3600000);
        let locale = 'id';
        let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
        let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' });

        let _uptime = process.uptime() * 1000;
        let uptime = clockString(_uptime);

        let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
            help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
            tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
            limit: plugin.limit,
            premium: plugin.premium,
        }));

        if (!teks) {
            let menuList = `${defaultMenu.before}\n`;
            for (let tag of arrayMenu) {
                if (tag && allTags[tag]) {
                    menuList += `© ${_p}menu ${tag}\n`;
                }
            }
            menuList += `\n${defaultMenu.after}`;

            let replace = { '%': '%', p: _p, uptime, name, date, time };
            let text = menuList.replace(/%(\w+)/g, (_, key) => replace[key]);

            await conn.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: text,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        externalAdReply: {
                            title: `📅 ${date} | ⏰ ${time} | 👤 ${name}`,
                            body: name,
                            mediaType: 1,
                            previewType: 0,
                            renderLargerThumbnail: true,
                            thumbnailUrl: 'https://api.betabotz.eu.org/api/tools/get-upload?id=f/wb4b22zt.jpg',
                            sourceUrl: 'https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w',
                        },
                    },
                    mentions: [m.sender],
                },
            }, {});
            return;
        }

        if (!allTags[teks]) {
            return m.reply(`❌ Menu "${teks}" tidak tersedia.\nCoba ketik ${_p}menu untuk melihat daftar menu.`);
        }

        let menuCategory = `${defaultMenu.header.replace(/%category/g, allTags[teks])}\n`;
        let categoryCommands = help.filter(menu => menu.tags.includes(teks) && menu.help);

        for (let menu of categoryCommands) {
            for (let help of menu.help) {
                menuCategory += defaultMenu.body
                    .replace(/%cmd/g, menu.prefix ? help : _p + help)
                    .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                    .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '') + '\n';
            }
        }

        menuCategory += defaultMenu.footer + '\n\n' + defaultMenu.after;

        let replace = { '%': '%', p: _p, uptime, name, date, time };
        let text = menuCategory.replace(/%(\w+)/g, (_, key) => replace[key]);

        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: text,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: `📅 ${date} | ⏰ ${time} | 👤 ${name}`,
                        body: name,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: 'https://api.betabotz.eu.org/api/tools/get-upload?id=f/wb4b22zt.jpg',
                        sourceUrl: 'https://whatsapp.com/channel/0029VacioNI6GcGLdAYO6Y1w',
                    },
                },
                mentions: [m.sender],
            },
        }, {});
        let sksk = `https://github.com/DGXeon/Tiktokmusic-API/raw/master/tiktokmusic/sound${Math.floor(Math.random() * 160)}.mp3`
 
await conn.sendFile(m.chat, sksk, 'sound.mp3', null, m, true)
} catch (e) {
        console.error('Terjadi error di handler menu:', e);
        conn.reply(m.chat, '❌ Maaf, terjadi kesalahan pada menu.', m);
    }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = /^(menu|help|bot)$/i;

handler.register = true;

module.exports = handler;

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}