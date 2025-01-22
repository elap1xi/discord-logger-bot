const clearCacheFolder = () => {
    const folderPath = 'cache/attachment/';
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    } else {
        fs.rm(folderPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error('Error clearing folder:', err);
            }
            fs.mkdirSync(folderPath, { recursive: true });
        });
    }
};

const download_image = async (url, name) => {
    const response = await axios({
        url,
        responseType: 'stream',
    });
    return new Promise((resolve, reject) => {
        response.data
            .pipe(fs.createWriteStream(name))
            .on('finish', resolve)
            .on('error', reject);
    });
};

const sendLogToWebhook = async (content, files, webhookLink, message) => {
    const fileAttachments = files.map(file => ({ attachment: file }));
    await webhookLink.send({
        username: message.author.globalName == null ? message.author.username : message.author.globalName,
        avatarURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=80`,
        content,
        files: fileAttachments,
    });
};

export async function logger(message){
    let ll = {
        // channelId to log
        "00000000000000000000": webhookclient_logger
    };

    var webhookLink = ll[message.channelId];
    if(!webhookLink) return;

    if (message.attachments.size > 0 || message.content.trim()) {
        try{
            clearCacheFolder();
            const attachments = message.attachments;
            const downloadedFiles = [];
    
            for (const attachment of attachments.values()) {
                const filename = `cache/attachment/${message.channelId}_${Date.now()}_image.png`;
                await download_image(attachment.url, filename);
                downloadedFiles.push(filename);
            }
            await sendLogToWebhook(message.content, downloadedFiles, webhookLink, message);

            downloadedFiles.forEach(file => {
                fs.unlink(file, (err) => {
                    if (err) console.error(`Failed to delete file: ${file}`, err);
                });
            });
        } catch (error) {
            console.error('Message Logger Error', error);
        }
    }
}

export { logger as default}