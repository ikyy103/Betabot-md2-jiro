// Wm :
https://whatsapp.com/channel/0029Vb9ZfML6GcGFm9aPgh0W

let uploadImage = require('../lib/uploadImage.js')
let fetch = require('node-fetch')

let handler = async (m, { conn, text }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return conn.reply(m.chat, 'Kirim gambar atau balas gambar dengan caption *aifilter <styleID>*

Contoh: *aifilter 7*

1. Animage model
2. Realistic Model  
3. Cute blind box  
4. Fantasy mecha  
8. Story book illustration  
9. Children picture book illustration  
11. Q version simple drawing  
12. Ink landscape  
13. Ink painting  
14. Sketch style  
15. Enhanced realism  
16. Oil painting  
25. 3D character  
26. 3D Pixar  
28. Chinese scenery  
29. Beautiful scenery  
31. Minimalist LOGO  
32. Advanced LOGO  
33. E-commerce products  
34. Modern Nordic  
35. General interior design  
36. Light luxury style interior  
37. Modern architecture  
43. Chinese style flat illustration  
44. Chinese style blind box  
46. Year of the Dragon Fantasy  
47. Year of the Dragon Avatar  
48. Eastern Dragon  
49. Western Dragon  
50. Q version 3D three views  
51. Sand sculpture hand-painted  
52. Clay style  
53. Paper-cut landscape  
54. Comic Lines  
58. Graffiti Lines  
59. Felt Doll  
60. Q Version 3D  
61. PhotographyModel  
62. White Moonlight  
63. Thick Illustration Boy  
64. Healing Boy  
65. Avatar Sketch  
66. Ruffian Handsome Man  
67. Ancient Costume Male God  
68. Cartoon Hand-painted  
69. Big Fight  
70. Expression Master  
71. Fox Mask  
72. Nine-tailed Fox  
73. Neon Lights  
74. Hong Kong Film  
75. Classical Dunhuang  
76. Healing Girl  
82. Cold Style  
83. Retro Anime  
84. FURINA  
85. NAHIDA  
86. SHOGUN  
87. KLEE  
88. AYAKA  
89. SHENHE  
90. KOKOMI  
91. GANYU  
92. MIKO  
93. HUTAO  
94. YOIMIYA  
95. KEQING  
96. BARBARA  
97. NILOU  
98. EULA  
99. NINGGUANG  
100. YELAN  
101. PAIMON  
102. lumine  
105. Indulge in freedom  
106. Emotional illustration  
107. Forgiveness  
108. Sea of roses  
109. Jumping colors  
110. Fashionable machinery  
111. Korean Wave Photo  
112. Watercolor Illustration  
113. Holographic Technology  
114. Healing Animation  
115. Journey to the West  
116. Colored Mud Fantasy  
117. Little Fresh  
118. Colorful Girl  
119. Graffiti Style  
120. Sloppy Painting Style  
121. Commercial Illustration  
122. Jade Texture  
123. Pixel World  
124. Children picture book  
125. Light lines  
126. Two-person illustration  
127. AnimeModelV5  
128. TechModelV7  
129. Chinese suspense  
130. Japanese suspense  
131. Style suspense  
132. Mechanical beetle  
133. Nature  
134. Oriental beauty', m)

    let styleID = text.trim()
    if (!styleID || isNaN(styleID)) return conn.reply(m.chat, `Gunakan format: *aifilter <styleID>*

Contoh: *aifilter 7*

1. Animage model
2. Realistic Model  
3. Cute blind box  
4. Fantasy mecha  
8. Story book illustration  
9. Children picture book illustration  
11. Q version simple drawing  
12. Ink landscape  
13. Ink painting  
14. Sketch style  
15. Enhanced realism  
16. Oil painting  
25. 3D character  
26. 3D Pixar  
28. Chinese scenery  
29. Beautiful scenery  
31. Minimalist LOGO  
32. Advanced LOGO  
33. E-commerce products  
34. Modern Nordic  
35. General interior design  
36. Light luxury style interior  
37. Modern architecture  
43. Chinese style flat illustration  
44. Chinese style blind box  
46. Year of the Dragon Fantasy  
47. Year of the Dragon Avatar  
48. Eastern Dragon  
49. Western Dragon  
50. Q version 3D three views  
51. Sand sculpture hand-painted  
52. Clay style  
53. Paper-cut landscape  
54. Comic Lines  
58. Graffiti Lines  
59. Felt Doll  
60. Q Version 3D  
61. PhotographyModel  
62. White Moonlight  
63. Thick Illustration Boy  
64. Healing Boy  
65. Avatar Sketch  
66. Ruffian Handsome Man  
67. Ancient Costume Male God  
68. Cartoon Hand-painted  
69. Big Fight  
70. Expression Master  
71. Fox Mask  
72. Nine-tailed Fox  
73. Neon Lights  
74. Hong Kong Film  
75. Classical Dunhuang  
76. Healing Girl  
82. Cold Style  
83. Retro Anime  
84. FURINA  
85. NAHIDA  
86. SHOGUN  
87. KLEE  
88. AYAKA  
89. SHENHE  
90. KOKOMI  
91. GANYU  
92. MIKO  
93. HUTAO  
94. YOIMIYA  
95. KEQING  
96. BARBARA  
97. NILOU  
98. EULA  
99. NINGGUANG  
100. YELAN  
101. PAIMON  
102. lumine  
105. Indulge in freedom  
106. Emotional illustration  
107. Forgiveness  
108. Sea of roses  
109. Jumping colors  
110. Fashionable machinery  
111. Korean Wave Photo  
112. Watercolor Illustration  
113. Holographic Technology  
114. Healing Animation  
115. Journey to the West  
116. Colored Mud Fantasy  
117. Little Fresh  
118. Colorful Girl  
119. Graffiti Style  
120. Sloppy Painting Style  
121. Commercial Illustration  
122. Jade Texture  
123. Pixel World  
124. Children picture book  
125. Light lines  
126. Two-person illustration  
127. AnimeModelV5  
128. TechModelV7  
129. Chinese suspense  
130. Japanese suspense  
131. Style suspense  
132. Mechanical beetle  
133. Nature  
134. Oriental beauty`, m)

    let media = await q.download()
    let uploadedImageUrl = await uploadImage(media)

    console.log(`Gambar berhasil diupload: ${uploadedImageUrl}`)
    
    let waitMsg = await conn.reply(m.chat, 'Sedang memproses gambar...', m)

    try {
        let apiUrl = `https://fastrestapis.fasturl.cloud/imgedit/aiimage?prompt=GeneratedImage&reffImage=${encodeURIComponent(uploadedImageUrl)}&style=${styleID}&width=1024&height=1024&creativity=0.5`
        let response = await fetch(apiUrl)
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`)
        }
        
        let buffer = await response.buffer()
        console.log(`Gambar berhasil diterima, ukuran: ${buffer.length} bytes`)
        
        await conn.sendMessage(m.chat, { 
            image: buffer, 
            caption: `✅ Style ID: ${styleID} | Proses selesai!` 
        }, { quoted: m })
        
    } catch (error) {
        console.error('Terjadi kesalahan:', error)
        conn.reply(m.chat, `Error: ${error.message}`, m)
    }
}

handler.help = ['aifilter <styleID>']
handler.tags = ['tools', 'premium']
handler.command = /^(aifilter)$/i
handler.premium = true

module.exports = handler