const path = require('path');
module.exports.config = {
	name: "music",
	version: "1.0.0",
	credits: "Zen",
	role: 0,
	aliases: ['play'],
	cooldown: 0,
	hasPrefix: false,
	usage: "",
};
module.exports.run = async function({
	api,
	event,
	args
}) {
	const fs = require("fs-extra");
	const ytdl = require("ytdl-core");
	const yts = require("yt-search");
	const musicName = args.join(' ');
	if (!musicName) {
		api.sendMessage(`𝙏𝙤 𝙜𝙚𝙩 𝙨𝙩𝙖𝙧𝙩𝙚𝙙, 𝙩𝙮𝙥𝙚 𝙢𝙪𝙨𝙞𝙘 𝙖𝙣𝙙 𝙩𝙝𝙚 𝙩𝙞𝙩𝙡𝙚 𝙤𝙛 𝙩𝙝𝙚 𝙨𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩.`, event.threadID, event.messageID);
		return;
	}
	try {
		api.sendMessage(`Searching for "${musicName}"...`, event.threadID, event.messageID);
		const searchResults = await yts(musicName);
		if (!searchResults.videos.length) {
			return api.sendMessage("Can't find the search.", event.threadID, event.messageID);
		} else {
			const music = searchResults.videos[0];
			const musicUrl = music.url;
			const stream = ytdl(musicUrl, {
				filter: "audioonly"
			});
			const time = new Date();
			const timestamp = time.toISOString().replace(/[:.]/g, "-");
			const filePath = path.join(__dirname, 'cache', `${timestamp}_music.mp3`);
			stream.pipe(fs.createWriteStream(filePath));
			stream.on('response', () => {});
			stream.on('info', (info) => {});
			stream.on('end', () => {
				if (fs.statSync(filePath).size > 26214400) {
					fs.unlinkSync(filePath);
					return api.sendMessage('𝗧𝗵𝗲 𝗳𝗶𝗹𝗲 𝗰𝗼𝘂𝗹𝗱 𝗻𝗼𝘁 𝗯𝗲 𝘀𝗲𝗻𝘁 𝗯𝗲𝗰𝗮𝘂𝘀𝗲 𝗶𝘁 𝗶𝘀 𝗹𝗮𝗿𝗴𝗲𝗿 𝘁𝗵𝗮𝗻 25𝗠𝗕.', event.threadID);
				}
				const message = {
					body: `${music.title}`,
					attachment: fs.createReadStream(filePath)
				};
				api.sendMessage(message, event.threadID, () => {
					fs.unlinkSync(filePath);
				}, event.messageID);
			});
		}
	} catch (error) {
		api.sendMessage('𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗽𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁.', event.threadID, event.messageID);
	}
};
