/*
 • Fitur By Anomaki Team
 • Created : xyzan code
 • Roblox Stalker
 • Jangan Hapus Wm
 • https://whatsapp.com/channel/0029Vaio4dYC1FuGr5kxfy2l

Scrape by han
*/
const cloudscraper = require("cloudscraper");

async function ui(userId) {
    const url = `https://users.roblox.com/v1/users/${userId}`;
    try {
        const response = await cloudscraper.get(url);
        return JSON.parse(response);
    } catch {
        return null;
    }
}

async function us(userId) {
    const url = `https://users.roblox.com/v1/users/${userId}/social`;
    try {
        const response = await cloudscraper.get(url);
        return JSON.parse(response);
    } catch {
        return null;
    }
}

async function uin(userId) {
    const url = `https://inventory.roblox.com/v1/users/${userId}/inventory`;
    try {
        const response = await cloudscraper.get(url);
        return JSON.parse(response);
    } catch {
        return null;
    }
}

async function up(userId) {
    const url = "https://presence.roblox.com/v1/presence/users";
    const payload = {
        userIds: [userId]
    };
    try {
        const response = await cloudscraper.post(url, {
            json: payload
        });
        return JSON.parse(response);
    } catch {
        return null;
    }
}

async function ugp(userId) {
    const url = `https://groups.roblox.com/v1/users/${userId}/groups/roles`;
    try {
        const response = await cloudscraper.get(url);
        return JSON.parse(response);
    } catch {
        return null;
    }
}

async function robloxStalk(userId) {
    const userInfo = await ui(userId);
    const userSocials = await us(userId);
    const userInventory = await uin(userId);
    const userPresence = await up(userId);
    const userGroups = await ugp(userId);

    return {
        userInfo,
        userSocials,
        userInventory,
        userPresence,
        userGroups,
    };
}

const handler = async (m, {
    text
}) => {
    if (!text) throw "Masukkan User ID Roblox";

    const data = await robloxStalk(text);

    if (!data.userInfo) throw "Gagal mendapatkan data pengguna";

    let message = "Informasi Pengguna Roblox\n";
    message += `- Nama: ${data.userInfo.name}\n`;
    message += `- Display Name: ${data.userInfo.displayName}\n`;
    message += `- ID: ${data.userInfo.id}\n`;
    message += `- Tentang: ${data.userInfo.description || "Tidak ada deskripsi"}\n\n`;

    if (data.userGroups?.data?.length) {
        message += "Grup\n";
        for (let group of data.userGroups.data) {
            message += `${group.group.name} (Role: ${group.role.name})\n`;
        }
        message += "\n";
    }

    if (data.userPresence?.userPresences?.length) {
        const presence = data.userPresence.userPresences[0];
        const status = presence.userPresenceType === 0 ? "Offline" :
            presence.userPresenceType === 1 ? "Online" :
            presence.userPresenceType === 2 ? "Sedang Main" :
            "Tidak Diketahui";
        message += `Status: ${status}\n`;
    }

    m.reply(message);
};

handler.help = ["rbs"];
handler.tags = ["internet"];
handler.command = /^rbs$/i;
handler.limit = 2;

module.exports = handler;