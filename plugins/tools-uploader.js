const axios = require('axios')
const FormData = require('form-data') 

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw 'Tidak ada media yang ditemukan'

  let media = await q.download()
  let fileSizeLimit = 15 * 1024 * 1024 // Maksimal 15MB bebas atur sendiri
  if (media.length > fileSizeLimit) {
    throw 'Ukuran media tidak boleh melebihi 15MB'
  }

  let isImageOrVideo = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)

  let form = new FormData()
  form.append('file', media, { filename: 'upload' })

  try {
    let { data } = await axios.post('https://fastrestapis.fasturl.cloud/downup/uploader-v1', form, {
      headers: {
        ...form.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    })

    if (data.status === 200) {
      m.reply(`✔️ *Upload Berhasil!*\n📂 Link: ${data.result}\n📦 Ukuran: ${media.length} Byte(s)\n⏳ Expired: ${isImageOrVideo ? 'Tidak Ada' : '24 Jam'}`)
    } else {
      throw 'Upload gagal, coba lagi nanti'
    }
  } catch (e) {
    console.error(e) // Menambahkan log error untuk debugging
    throw 'Terjadi kesalahan saat mengunggah file'
  }
}

handler.help = ['tourl <reply media>']
handler.tags = ['tools']
handler.command = /^(upload|tourl)$/i

module.exports = handler