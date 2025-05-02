let handler = async (m, { conn, text, usedPrefix, command }) => {
  const q = m.quoted || m
  const mime = (q.msg || q).mimetype || ''

  let codeToConvert = text

  if (!text && q.fileSha256) {
    // Kalau file
    let buffer = await q.download()
    let contentType = mime.split('/')[0]

    // Kalau file teks, langsung baca string-nya
    if (contentType === 'text' || mime.includes('json') || mime.includes('javascript')) {
      codeToConvert = buffer.toString()
    } else {
      return m.reply(`File bertipe *${mime}* tidak bisa diproses untuk konversi kode.`)
    }
  }

  if (!codeToConvert) throw `Masukkan teks atau reply file/teks berisi kode yang ingin diubah.`

  let result
  if (command === 'toesm') {
    result = convertCJSToESM(codeToConvert)
  } else if (command === 'tocjs') {
    result = convertESMToCJS(codeToConvert)
  } else {
    throw `Perintah tidak dikenal`
  }

  m.reply(`Hasil konversi:\n\n${result}`)
}

handler.help = ['toesm <kode>', 'tocjs <kode> (bisa reply file teks)']
handler.tags = ['tools']
handler.command = /^(toesm|tocjs)$/i
handler.limit = true

module.exports = handler

// Fungsi convert CJS ke ESM
function convertCJSToESM(code) {
  return code
    .replace(/const (\w+) = require['"](.+?)['"];?/g, 'import $1 from \'$2\';')
    .replace(/let (\w+) = require['"](.+?)['"];?/g, 'import $1 from \'$2\';')
    .replace(/var (\w+) = require['"](.+?)['"];?/g, 'import $1 from \'$2\';')
    .replace(/module\.exports\s*=\s*({?.*}?);?/g, 'export default $1;')
    .replace(/exports\.(\w+)\s*=\s*(\w+);?/g, 'export const $1 = $2;')
}

// Fungsi convert ESM ke CJS
function convertESMToCJS(code) {
  return code
    .replace(/import (\w+) from ['"](.+?)['"];/g, 'const $1 = require(\'$2\');')
    .replace(/import \* as (\w+) from ['"](.+?)['"];/g, 'const $1 = require(\'$2\');')
    .replace(/import \{(.*?)\} from ['"](.+?)['"];/g, (match, p1, p2) => {
      const imports = p1.split(',').map(i => i.trim())
      return `const { ${imports.join(', ')} } = require('${p2}');`
    })
    .replace(/export default (\w+);?/g, 'module.exports = $1;')
    .replace(/export const (\w+) = (\w+);?/g, 'exports.$1 = $2;')
}