let handler = async (m, { conn, text }) => {
  let id = m.chat;
  conn.math = conn.math || {};

  // Jika ada sesi kalkulator sebelumnya
  if (id in conn.math) {
    clearTimeout(conn.math[id][3]);
    delete conn.math[id];
    m.reply('Hmmm... ngecheat?');
    return;
  }

  // Validasi dan penggantian simbol untuk perhitungan
  let val = text
    .replace(/[^0-9\-\/+*×÷πEe()piPI]/g, '') // Hanya simbol yang valid
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π|pi/gi, 'Math.PI')
    .replace(/e/gi, 'Math.E')
    .replace(/\/+/g, '/')
    .replace(/\++/g, '+')
    .replace(/-+/g, '-');

  // Format tampilan hasil
  let format = val
    .replace(/Math\.PI/g, 'π')
    .replace(/Math\.E/g, 'e')
    .replace(/\//g, '÷')
    .replace(/\*/g, '×');

  try {
    console.log(`Input: ${val}`);

    // Evaluasi ekspresi matematika
    let result = (new Function('return ' + val))();

    // Tangani pembagian dengan nol
    if (!isFinite(result)) {
      result = 'Hasil tak terhingga (Infinity)';
    }

    // Balas hasil perhitungan
    m.reply(`*${format}* = _${result}_`);
  } catch (e) {
    if (e === undefined) throw 'Isinya?';
    throw 'Format salah! Hanya mendukung angka 0-9 dan simbol -, +, *, /, ×, ÷, π, e, (, )';
  }
};

handler.help = ['kalkulator <soal>'];
handler.tags = ['tools'];
handler.command = /^(calc(ulat(e|or))?|kalk(ulator)?)$/i;
handler.exp = 5;
handler.register = false;

module.exports = handler;