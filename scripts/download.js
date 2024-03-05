const fs = require('fs-extra');
const axios = require('axios').default;
const path = require('path');
const extract = require('extract-zip');

async function download({ assetUrl, localFilePath }) {
  try {
    console.log(`Downloading  from ${assetUrl}`);
    const response = await axios.get(assetUrl, {
      responseType: 'arraybuffer',
    });

    const fileData = Buffer.from(response.data, 'binary');

    await fs.writeFile(localFilePath, fileData);

    console.log(`Downloaded to ${localFilePath}`);
    await new Promise((res) => setTimeout(res, 2000));
    console.log('Done');
  } catch (error) {
    console.error(`Error downloading asset: ${error.message}`);
  }
}
