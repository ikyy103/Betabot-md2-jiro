const recipeDatabase = {
    'stroberi': ['Pancake Stroberi', 'Salad Stroberi'],
    'coklat': ['Coklat Panas', 'Brownies Coklat']
};

let handler = async (m, { text }) => {
    if (!text) return m.reply('Masukkan bahan utama, seperti: stroberi atau coklat.');
    let recipes = recipeDatabase[text.toLowerCase()];
    if (!recipes) return m.reply('Bahan tidak ditemukan. Coba bahan lain.');
    let response = `🥗 Resep dengan bahan ${text}:\n\n- ${recipes.join('\n- ')}`;
    m.reply(response);
};
handler.command = /^stroberi$/i;
handler.help = ['stroberi [bahan]'];
handler.tags = ['food'];
module.exports = handler;