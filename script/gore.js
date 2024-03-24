const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "gore",
  version: "9.0",
  hasPermssion: 0,
  description: "Random gore video",
  commandCategory: "not for kids",
  usages: "gore",
  cooldowns: 9,
  credits: "Eugene Aguilar",
};

module.exports.run = async function ({ api, event }) {
  const { sendMessage: reply } = api;
  try {
    reply(`gore is sending please wait ...`, event.threadID, event.messageID);

    const gen = await axios.get(`https://hiroshi-hub.replit.app/gore`);
    const video = gen.data.link;
    if (!video) {
      return reply(`No gore video found!!`, event.threadID, event.messageID);
    }

    const res = await axios.get(video, { responseType: "arraybuffer" });
    const pathToFile = path.join(__dirname, `cache/gore.mp4`);

    fs.writeFileSync(pathToFile, Buffer.from(res.data, "utf-8"));

    reply({ body: `Here's your gore video, enjoy!!`, attachment: fs.createReadStream(pathToFile) }, event.threadID, event.messageID);
  } catch (error) {
    reply(`Error fetching gore api!!\n${error}`, event.threadID, event.messageID);
    console.log(error);
  }
};