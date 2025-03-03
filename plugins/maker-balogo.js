const { resolve } = require('path');
const sharp = require('sharp');
const { promises: fs } = require('fs');

let handler = async (m, { conn, args, text }) => {
    const fontfile = resolve(__dirname, '../gallery/ba.ttf');
    const font = 'BlueArchive';

    const cross = sharp(resolve(__dirname, '../gallery/cross.png')).extract({
        left: 0,
        top: 0,
        height: 400,
        width: 500,
    }).png();

    const halo = sharp(resolve(__dirname, '../gallery/halo.png')).extract({
        left: 0,
        top: 0,
        height: 400,
        width: 500,
    }).png();

    const matrix = [[1, -0.35], [0, 1]];

    const splitText = (text) => {
        if (Array.isArray(text)) return text;
        if (text.includes(' ')) {
            return text.split(' ').filter(i => i.trim());
        } else if (text.match(/^[A-Z][a-z]*[A-Z][a-z]*$/)) {
            return text.replace(/[A-Z]/g, t => ' ' + t).trim().split(' ');
        } else {
            const h = Math.floor(text.length / 2);
            return [text.substring(0, h), text.substring(h)];
        }
    };

    const baLogo = async (text, left = 0) => {
        const [head, tail] = splitText(text);
        if (!head || !tail) throw new Error('Invalid input text');
        let width = 32, height = 260;
        const top = 208;
        const comps = [];

        const headPart = sharp({
            text: {
                font, fontfile,
                text: `<span color="#208ef7" size="144pt">${head}</span>`,
                dpi: 72,
                rgba: true,
            }
        }).affine(matrix, {
            background: '#fff0',
            interpolator: sharp.interpolators.nohalo
        }).png();

        const headMeta = await headPart.metadata();
        const w = width + headMeta.width - 162;
        const dl = w < 0 ? 0 : w + left;

        const tailPart = sharp({
            text: {
                font, fontfile,
                text: `<span color="#208ef7" size="144pt">${head}<span color="#2b2b2b" size="144pt">${tail}</span></span>`,
                dpi: 72,
                rgba: true,
            }
        }).affine(matrix, {
            background: '#fff0',
            interpolator: sharp.interpolators.nohalo
        }).png();

        const tailMeta = await tailPart.metadata();
        comps.push({
            input: await tailPart.toBuffer(),
            left: width,
            top,
        });

        comps.push({
            input: Buffer.from(`<svg width="480" height="200" version="1.1">
                <polygon points="252,0 159,190 165,190 287,0" style="fill:#fff" />
            </svg>`),
            left: dl + 4,
            top,
        }, {
            input: await halo.toBuffer(),
            left: dl,
            top: 0
        }, {
            input: await cross.toBuffer(),
            left: dl + 4,
            top: 4,
        });

        width += (tailMeta.width < 256 ? 256 : tailMeta.width) + 64;
        height += 144;
        if (width < 500) width = 500;

        return sharp({
            create: {
                width, height,
                channels: 4,
                background: '#fff'
            },
        }).composite(comps).png();
    };

    try {
        let [kiri, kanan] = text.split('|');
        if (!kiri || !kanan) return m.reply('> Mana textnya? Contoh: .balogo hann|apalaa');
        const logo = await baLogo([kiri, kanan]);
        const res = await logo.toBuffer();
        conn.sendMessage(m.chat, { image: res }, { quoted: m });
    } catch (error) {
        return m.reply(error.message);
    }
};

handler.help = ['balogo <text>'];
handler.tags = ['maker'];
handler.command = /^(balogo)$/i;
handler.limit = true;

module.exports = handler;