let handler = async (m, { conn, args }) => {
    let movieName = args.join(" ");
    if (!movieName) throw `Silakan masukkan nama film yang ingin dicari.`;

    // Melakukan permintaan ke API
    let res = await fetch(`https://fastrestapis.fasturl.cloud/search/film?name=${encodeURIComponent(movieName)}&limit=1`);
    let data = await res.json();

    if (data.status !== 200 || !data.result.results.length) {
        throw `Film tidak ditemukan.`;
    }

    let movie = data.result.results[0].hits[0];
    
    // Pastikan movie ada sebelum mendestructure
    if (!movie) {
        throw `Data film tidak tersedia.`;
    }

    let { title, overview, poster_path, release_date, vote_average, external_ids } = movie;

    // Mengubah poster_path menjadi URL lengkap
    let posterUrl = `https://image.tmdb.org/t/p/w780${poster_path}`;

    // Membuat thumbnail
    await conn.relayMessage(m.chat, {
        extendedTextMessage: {
            text: `🎬 **Judul:** ${title}\n📅 **Tanggal Rilis:** ${release_date}\n⭐ **Rating:** ${vote_average}\n\n📖 **Deskripsi:** ${overview}`,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: `${title}`,
                    body: overview,
                    mediaType: 1,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnailUrl: posterUrl,
                    sourceUrl: `https://www.imdb.com/title/${external_ids.imdb_id}/`,
                },
            },
            mentions: [m.sender],
        },
    }, {});
};

handler.help = ['film <nama film>'];
handler.tags = ['info'];
handler.command = /^(film)$/i;
handler.limit = true;

module.exports = handler;