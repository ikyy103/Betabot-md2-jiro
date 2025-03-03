const axios = require("axios");
const PhoneNumber = require("awesome-phonenumber");

let handler = async (m, { conn, args }) => {
    if (!args[0]) {
        return m.reply("Nomornya mana?");
    }

    let phoneNumber = args[0].replace(/[^0-9]/g, ""); // Hanya angka  
    if (!(phoneNumber.startsWith("08") || phoneNumber.startsWith("62"))) {
        return m.reply("Hanya nomor Indonesia yang didukung!");
    }

    phoneNumber = phoneNumber.startsWith("08") ? phoneNumber.replace("08", "62") : phoneNumber;
    if (phoneNumber + "@s.whatsapp.net" === conn.user.jid) {
        return m.reply("Itu nomor bot?");
    }

    const isValid = await conn.onWhatsApp(phoneNumber + "@s.whatsapp.net");
    if (isValid.length == 0) {
        return m.reply("Nomor tidak ditemukan di WhatsApp!");
    }

    try {
        const emailData = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
        const email = emailData.data[0];

        const generateTextBypassBan = (difficulty, phoneNumber, name, banReason = null) => {
            const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

            const greetings = [
                "Kepada Tim WhatsApp,", "Yang Terhormat Tim WhatsApp,", "Halo Tim WhatsApp,", 
                "Kepada Yth. Tim WhatsApp,", "Tim WhatsApp yang terhormat,"
            ];

            const reasons = {
                "super hard": [
                    "Saya tiba-tiba tidak bisa mengakses akun WhatsApp saya dan menerima pemberitahuan bahwa akun saya telah diblokir karena dugaan pelanggaran berat terhadap kebijakan WhatsApp.",
                    "Akun saya terkena blokir tanpa saya mengetahui kesalahan apa yang telah saya lakukan, dan saya diberitahu bahwa ini adalah pelanggaran berat."
                ],
                "hard": [
                    "Akun WhatsApp saya mendadak tidak dapat diakses, dan saya menerima notifikasi bahwa ada dugaan pelanggaran terhadap kebijakan WhatsApp.",
                    "Saya mengalami masalah karena akun saya diblokir akibat dugaan pelanggaran aturan, padahal saya selalu menggunakan WhatsApp dengan baik."
                ],
                "easy": [
                    "Saya mendapati akun saya tidak bisa digunakan dan mendapat pemberitahuan bahwa ada aktivitas yang tidak biasa.",
                    "Akun saya sepertinya diblokir akibat kesalahan teknis atau aktivitas yang tidak disengaja."
                ]
            };

            const apologies = [
                "Saya benar-benar menyesal atas kesalahpahaman ini dan berjanji akan lebih berhati-hati ke depannya.",
                "Jika ada hal yang dianggap melanggar kebijakan, saya memohon maaf sebesar-besarnya."
            ];

            const justification = [
                "Saya menggunakan WhatsApp untuk berkomunikasi dengan keluarga dan rekan kerja saya setiap hari, dan kehilangan akses ini membuat saya sangat kesulitan.",
                "Akun WhatsApp ini sangat penting bagi saya karena saya menggunakannya untuk urusan bisnis dan komunikasi dengan pelanggan."
            ];

            const closing = [
                "Terima kasih atas waktu dan perhatian Tim WhatsApp. Saya sangat menghargai kebijakan serta usaha dalam menjaga keamanan platform ini.",
                "Saya sangat berharap akun saya dapat dipulihkan dan saya dapat kembali menggunakan WhatsApp untuk kebutuhan komunikasi saya."
            ];

            return `
Subjek: Permohonan Pemulihan Akun WhatsApp

${randomPick(greetings)}

Saya ingin menyampaikan permohonan terkait pemblokiran akun WhatsApp saya. ${randomPick(reasons[difficulty])} ${banReason ? `Saya diberitahu bahwa akun saya diblokir karena ${banReason}.` : ""} ${randomPick(apologies)}

${randomPick(justification)} Saya berharap tim WhatsApp dapat membantu saya untuk mendapatkan kembali akses ke akun saya.

Nomor WhatsApp saya yang terblokir adalah: ${phoneNumber}. Saya benar-benar berharap dapat menggunakan kembali layanan ini sesegera mungkin.

${randomPick(closing)}

Salam hormat,  
${name}  
            `;
        };

        const message = generateTextBypassBan("super hard", phoneNumber, "Andhika", "menggunakan aplikasi pihak ketiga");

        const form = new URLSearchParams();
        form.append("phone_number", PhoneNumber("+" + phoneNumber).getNumber("international"));
        form.append("email", email);
        form.append("email_confirm", email);
        form.append("platform", "ANDROID");
        form.append("your_message", message);
        
        const res = await axios({
            url: "https://www.whatsapp.com/contact/noclient/",
            method: "POST",
            data: form
        });

        const response = res.data;
        if (response.includes(`"payload":true`)) {
            m.reply("Permohonan berhasil dikirim. Tunggu tanggapan dari WhatsApp.");
        } else if (response.includes(`"payload":false`)) {
            m.reply("Permohonan ditolak atau memerlukan verifikasi lebih lanjut.");
        } else {
            m.reply("Terjadi kesalahan. Silakan coba lagi.");
        }

    } catch (err) {
        m.reply(`Terjadi kesalahan: ${err}`);
    }
};

handler.tags = ['owner'];
handler.help = ['bypassban'];
handler.command = /^(bypassban)$/i;
handler.premium = true;

module.exports = handler;