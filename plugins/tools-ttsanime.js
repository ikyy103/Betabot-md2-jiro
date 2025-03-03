const fetch = require('node-fetch');

let models = [
    "特别周 Special Week (Umamusume Pretty Derby)",
    "无声铃鹿 Silence Suzuka (Umamusume Pretty Derby)",
    "东海帝王 Tokai Teio (Umamusume Pretty Derby)",
    "丸善斯基 Maruzensky (Umamusume Pretty Derby)",
    "富士奇迹 Fuji Kiseki (Umamusume Pretty Derby)",
    "小栗帽 Oguri Cap (Umamusume Pretty Derby)",
    "黄金船 Gold Ship (Umamusume Pretty Derby)",
    "伏特加 Vodka (Umamusume Pretty Derby)",
    "大和赤骥 Daiwa Scarlet (Umamusume Pretty Derby)",
    "大树快车 Taiki Shuttle (Umamusume Pretty Derby)",
    "草上飞 Grass Wonder (Umamusume Pretty Derby)",
    "菱亚马逊 Hishi Amazon (Umamusume Pretty Derby)",
    "目白麦昆 Mejiro Mcqueen (Umamusume Pretty Derby)",
    "神鹰 El Condor Pasa (Umamusume Pretty Derby)",
    "五郎 Gorou (Genshin Impact)",
    "派蒙 Paimon (Genshin Impact)",
    "钟离 Zhongli (Genshin Impact)",
    "雷电将军 Raiden Shogun (Genshin Impact)",
    "温迪 Venti (Genshin Impact)",
    "神里绫华 Kamisato Ayaka (Genshin Impact)",
    "甘雨 Ganyu (Genshin Impact)",
    "胡桃 Hu Tao (Genshin Impact)",
    "达达利亚 Tartalia (Genshin Impact)",
    "申鹤 Shenhe (Genshin Impact)",
    "琴 Jean (Genshin Impact)",
    "夜兰 Yelan (Genshin Impact)",
    "雷泽 Razor (Genshin Impact)",
    "诺艾尔 Noelle (Genshin Impact)",
    "枫原万叶 Kaedehara Kazuha (Genshin Impact)",
    "魈 Xiao (Genshin Impact)",
    "八重神子 Yae Miko (Genshin Impact)",
    "凯亚 Kaeya (Genshin Impact)",
    "优菈 Eula (Genshin Impact)",
    "流浪者 Wanderer (Genshin Impact)",
    "珊瑚宫心海 Sangonomiya Kokomi (Genshin Impact)",
    "香菱 Xiangling (Genshin Impact)",
    "夜宵 Yoimiya (Genshin Impact)",
    "云堇 Yun Jin (Genshin Impact)",
    "辛焱 Xinyan (Genshin Impact)",
    "丽莎 Lisa (Genshin Impact)",
    "班尼特 Bennett (Genshin Impact)",
    "多莉 Dori (Genshin Impact)",
    "行秋 Xingqiu (Genshin Impact)",
    "刻晴 Keqing (Genshin Impact)",
    "艾尔海森 Alhaitham (Genshin Impact)",
    "纳西妲 Nahida (Genshin Impact)"
]; // Semua model dari daftar telah dimasukkan

let handler = async (m, { text, conn }) => {
    let args = text.split('|');
    if (args.length < 2) {
        return conn.reply(m.chat, `🚩 Format salah!\n\n*Contoh:* .ttsanime 5|Halo, apa kabar?\n\n💡 Pilih model dengan angka:\n${models.map((m, i) => `${i + 1}. ${m}`).join('\n')}`, m);
    }

    let modelIndex = parseInt(args[0]) - 1;
    if (modelIndex < 0 || modelIndex >= models.length) {
        return conn.reply(m.chat, "🚩 Nomor model tidak valid! Pilih dari daftar yang tersedia.", m);
    }

    let selectedModel = models[modelIndex].split(" (")[0]; // Ambil hanya nama model tanpa kategori
    let textToSpeech = args[1].trim();
    let apiUrl = `https://fastrestapis.fasturl.cloud/tts/anime?text=${encodeURIComponent(textToSpeech)}&speed=1&language=English&model=${encodeURIComponent(selectedModel)}`;

    try {
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Gagal mendapatkan audio!");

        let buffer = await response.buffer();
        conn.sendFile(m.chat, buffer, "tts.mp3", "✅ Berikut suara anime yang kamu minta!", m);
    } catch (e) {
        console.log(e);
        conn.reply(m.chat, "🚩 Terjadi kesalahan saat mengambil audio!", m);
    }
};

handler.help = ['ttsanime'];
handler.tags = ['tools'];
handler.command = /^ttsanime$/i;
module.exports = handler;