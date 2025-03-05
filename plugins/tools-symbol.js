const handler = async (m, { args }) => {
    let categories = {
        "star-symbols": [
            ["★", "☆", "✪", "✭", "✯", "✰", "⭐"],
            ["🌟", "✵", "✶", "✷", "✸", "✹", "✺"],
            ["✻", "✼", "✽", "❂", "❁", "❃", "❉"]
        ],
        "heart-symbols": [
            ["❤", "♡", "💖", "💗", "💓", "💞", "💘"],
            ["💝", "💛", "💜", "🧡", "💙", "💚", "❥"]
        ],
        "arrow-symbols": [
            ["→", "←", "↑", "↓", "↔", "↕", "↖"],
            ["↗", "↘", "↙", "➔", "➜", "➝", "➞"],
            ["➟", "➠", "➢", "➣", "➤", "➥", "➦"],
            ["➧", "➨", "➩", "➪", "➫", "➬", "➭"]
        ],
        "music-symbols": [
            ["♫", "♪", "♩", "♬", "🎵", "🎶", "🎼"],
            ["🎤", "🎧", "🎷", "🎸", "🎹", "🥁", "🎺"]
        ],
        "currency-symbols": [
            ["$", "€", "£", "¥", "₹", "₩", "₽"],
            ["₿", "₵", "₫", "₭", "₮", "₦", "₱"],
            ["₲", "₴", "₡", "₤", "₰", "₳", "₵"]
        ]
    };

    if (args.length < 2) return m.reply("⚠️ Gunakan format: *.symbol <kategori> <nomor_baris>*\nContoh: *.symbol star-symbols 1*\n\nBerikut list kategori :\n\n1. star-symbols\n\n2. heart-symbols\n\n3. arrow-symbols\n\n4. music-symbols\n\n5. currency-symbols");

    let category = args[0].toLowerCase();
    let rowIndex = parseInt(args[1]) - 1;

    if (!categories[category]) return m.reply(`❌ Kategori tidak ditemukan! Coba salah satu:\n${Object.keys(categories).join(", ")}`);
    if (rowIndex < 0 || rowIndex >= categories[category].length) return m.reply(`❌ Baris ke-${args[1]} tidak tersedia di kategori ${category}.`);

    let symbols = categories[category][rowIndex].join(" ");
    m.reply(`⭐ *Kategori:* ${category}\n📌 *Baris ${args[1]}:* ${symbols}`);
};

handler.command = /^(symbol)$/i;
handler.tags = ["tools"];
handler.help = ["symbol <kategori> <nomor_baris>"];

module.exports = handler;