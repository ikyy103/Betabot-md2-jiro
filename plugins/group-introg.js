const handlerIntroView = async (m, { conn }) => {
    const user = global.db.data.users[m.sender];

    // Template kartu intro
    let introTemplate = `
╭─── *「 Kartu Intro 」*
│
│ *Nama     :* ${user.nama || 'Belum diatur'}
│ *Gender   :* ${user.gender || 'Belum diatur'}
│ *Umur      :* ${user.umur || 'Belum diatur'}
│ *Hobby    :* ${user.hobby || 'Belum diatur'}
│ *Kelas      :* ${user.kelas || 'Belum diatur'}
│ *Asal         :* ${user.asal || 'Belum diatur'}
│ *Agama    :* ${user.agama || 'Belum diatur'}
│ *Status     :* ${user.status || 'Belum diatur'}
╰──────────────`;

    conn.reply(m.chat, introTemplate, m);
};

handlerIntroView.command = /^introg$/i;
handlerIntroView.help = ['introg'];
handlerIntroView.tags = ['group'];
handlerIntroView.group = true;

module.exports = handlerIntroView;