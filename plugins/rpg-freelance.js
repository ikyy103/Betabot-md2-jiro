let handler = async (m, { conn, usedPrefix, command, args }) => {
    const MAX_FREELANCE_PER_DAY = 2;

    // Data pekerjaan freelance
    const jobs = [
        { name: 'Penulis Artikel', difficulty: 'mudah', reward: { limit: 5, money: 100, exp: 10 } },
        { name: 'Desainer Grafis', difficulty: 'sedang', reward: { limit: 10, money: 300, exp: 30 } },
        { name: 'Programmer', difficulty: 'sulit', reward: { limit: 20, money: 700, exp: 70 } },
        { name: 'Penerjemah', difficulty: 'mudah', reward: { limit: 60, money: 150, exp: 150 } },
        { name: 'Konsultan Bisnis', difficulty: 'sedang', reward: { limit: 80, money: 400, exp: 400 } },
        { name: 'Data Analyst', difficulty: 'sulit', reward: { limit: 85, money: 1000, exp: 1000 } },
        { name: 'Fotografer', difficulty: 'mudah', reward: { limit: 90, money: 2000, exp: 200 } },
        { name: 'Pengembang Web', difficulty: 'sulit', reward: { limit: 100, money: 1200, exp: 1200 } }
    ];

    // Mengambil data user
    let userData = global.db.data.users[m.sender];

    // Inisialisasi data user jika belum ada
    if (!userData) {
        global.db.data.users[m.sender] = {
            freelanceCount: 0,
            lastFreelance: 0
        };
        userData = global.db.data.users[m.sender];
    }

    // Periksa batas penggunaan per hari
    let currentDate = new Date().toDateString();
    if (userData.lastFreelance !== currentDate) {
        userData.freelanceCount = 0;
        userData.lastFreelance = currentDate;
    }

    if (userData.freelanceCount >= MAX_FREELANCE_PER_DAY) {
        return m.reply(`❌ Anda telah mencapai batas maksimal penggunaan freelance sebanyak ${MAX_FREELANCE_PER_DAY} kali per hari.`);
    }

    // Menampilkan daftar pekerjaan jika tidak ada argumen
    if (!args[0]) {
        let jobList = `📋 *Daftar Pekerjaan Freelance*\n\n`;
        jobs.forEach((job, index) => {
            jobList += `${index + 1}. ${job.name} (Kesulitan: ${job.difficulty})\n`;
        });
        jobList += `\nGunakan *${usedPrefix}${command} [nomor_pekerjaan]* untuk memilih pekerjaan.\nContoh: *${usedPrefix}${command} 1*`;
        return m.reply(jobList);
    }

    // Memproses pilihan user
    let jobIndex = parseInt(args[0]) - 1;
    if (isNaN(jobIndex) || jobIndex < 0 || jobIndex >= jobs.length) {
        return m.reply(`⚠️ Pilihan pekerjaan tidak valid. Silakan pilih dengan angka yang sesuai.`);
    }

    let selectedJob = jobs[jobIndex];

    // Memberikan reward
    userData.limit = (userData.limit || 0) + selectedJob.reward.limit;
    userData.money = (userData.money || 0) + selectedJob.reward.money;
    userData.exp = (userData.exp || 0) + selectedJob.reward.exp;

    // Menambah count freelance
    userData.freelanceCount += 1;

    // Pesan reward
    let rewardMessage = `🎉 *Freelance Selesai*\n\nAnda telah menyelesaikan pekerjaan *${selectedJob.name}* (Kesulitan: ${selectedJob.difficulty}).\n\n🎁 *Reward*\n- Limit: ${selectedJob.reward.limit}\n- Money: ${selectedJob.reward.money}\n- Exp: ${selectedJob.reward.exp}\n\nSisa kesempatan penggunaan freelance hari ini: ${MAX_FREELANCE_PER_DAY - userData.freelanceCount} kali.`;
    await conn.sendMessage(m.chat, { text: rewardMessage });
};

handler.help = ['freelance'];
handler.tags = ['rpg'];
handler.command = /^freelance$/i;

module.exports = handler;