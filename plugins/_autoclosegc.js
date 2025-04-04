let moment = require('moment-timezone')
let schedule = require('node-schedule')

const timeZone = 'Asia/Jakarta';
let groupStatus = {};
let originalGroupNames = {};
let reminderSent = {};

async function checkAutoClose(conn) {
  let now = moment().tz(timeZone).format('HH:mm');
  let allGc = db.data.autoclose || {};

  for (let chatId in allGc) {
    let setting = allGc[chatId];
    if (!setting.aktif) continue;

    let closeTime = setting.tutup;
    let openTime = setting.buka;

    let groupMetadata = await conn.groupMetadata(chatId);
    let currentName = groupMetadata.subject;

    if (!originalGroupNames[chatId]) {
      originalGroupNames[chatId] = currentName;
    }

    let closeReminder = moment(closeTime, 'HH:mm').subtract(5, 'minutes').format('HH:mm');
    let openReminder = moment(openTime, 'HH:mm').subtract(5, 'minutes').format('HH:mm');

    if (now === closeReminder && !reminderSent[`${chatId}-close`]) {
      await conn.sendMessage(chatId, { text: `𝗣𝗘𝗥𝗜𝗡𝗚𝗔𝗧𝗔𝗡!!\n\n<-> ɢʀᴏᴜᴘ ᴀᴋᴀɴ ᴛᴇʀᴛᴜᴛᴜᴘ 5 ᴍᴇɴɪᴛ ʟᴀɢɪ <->` });
      reminderSent[`${chatId}-close`] = true;
    }

    if (now === openReminder && !reminderSent[`${chatId}-open`]) {
      await conn.sendMessage(chatId, { text: `𝗣𝗘𝗥𝗜𝗡𝗚𝗔𝗧𝗔𝗡!!\n\n<-> ɢʀᴏᴜᴘ ᴀᴋᴀɴ ᴛᴇʀʙᴜᴋᴀ 5 ᴍᴇɴɪᴛ ʟᴀɢɪ <->` });
      reminderSent[`${chatId}-open`] = true;
    }

    if (now === closeTime && groupStatus[chatId] !== 'closed') {
      await conn.groupSettingUpdate(chatId, 'announcement');
      await conn.groupUpdateSubject(chatId, `${originalGroupNames[chatId]} (𝗖𝗟𝗢𝗦𝗘)`);
      await conn.sendMessage(chatId, { text: `( OTOMATIS ) 𝖦𝖱𝖮𝖴𝖯 𝖢𝖫𝖮𝖲𝖤, 𝖣𝖠𝖭 𝖠𝖪𝖠𝖭 𝖣𝖨𝖡𝖴𝖪𝖠 𝖩𝖠𝖬 ${openTime} 𝖶𝖨𝖡` });
      groupStatus[chatId] = 'closed';
      reminderSent[`${chatId}-close`] = false;
    }

    if (now === openTime && groupStatus[chatId] !== 'opened') {
      await conn.groupSettingUpdate(chatId, 'not_announcement');
      await conn.groupUpdateSubject(chatId, originalGroupNames[chatId]);
      await conn.sendMessage(chatId, { text: `( OTOMATIS ) 𝖦𝖱𝖮𝖴𝖯 𝖮𝖯𝖤𝖭, 𝖣𝖠𝖭 𝖠𝖪𝖠𝖭 𝖣𝖨𝖳𝖴𝖳𝖴𝖯 𝖩𝖠𝖬 ${closeTime} 𝖶𝖨𝖡` });
      groupStatus[chatId] = 'opened';
      reminderSent[`${chatId}-open`] = false;
    }
  }
}

// Jalankan pengecekan tiap 1 menit
schedule.scheduleJob('* * * * *', () => {
  checkAutoClose(global.conn);
});