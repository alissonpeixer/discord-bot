const { joinVoiceChannel } = require("@discordjs/voice");
module.exports = function Connection(interaction) {
  return joinVoiceChannel({
    channelId: interaction.member.voice.channel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });
};
