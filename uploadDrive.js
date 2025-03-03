const fs = require('fs');

const path = require('path');

const { google } = require('googleapis');

// Load credentials JSON

const KEYFILEPATH = path.join(__dirname, 'credentials.json');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({

    keyFile: KEYFILEPATH,

    scopes: SCOPES,

});

const drive = google.drive({ version: 'v3', auth });

async function uploadFile(filePath) {

    try {

        const fileMetadata = {

            name: path.basename(filePath),

            parents: ['1MEQA4vJTj37o4SA2TOzzyWfPXhBbrAOu'], // Ganti dengan ID folder Google Drive

        };

        const media = {

            mimeType: 'application/octet-stream',

            body: fs.createReadStream(filePath),

        };

        const file = await drive.files.create({

            resource: fileMetadata,

            media: media,

            fields: 'id, webViewLink, webContentLink',

        });

        return {

            id: file.data.id,

            viewLink: file.data.webViewLink,

            downloadLink: file.data.webContentLink,

        };

    } catch (error) {

        console.error('Error uploading file:', error);

        throw error;

    }

}

module.exports = uploadFile;