
export default function handler(req, res) {


  // Next.js API route support: https://nextjs.org/docs/api-routes/introduction

  const { PlayerManager } = require("discord-player-plus");
  const { Client, GatewayIntentBits, Partials } = require("discord.js")

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates
    ],
    presence: [
      Partials.Channel,
      Partials.Message
    ]
  });


  client.once('ready', data => {
    global.guildsName = []

    client.guilds.cache.forEach(guild => { guildsName.push(guild) });
    console.log(`Bot online no servers, ${guildsName}`)
  })





  client.on("messageCreate", async (interaction) => {

    if (interaction.content.split(' ')[0] === `play`) {
      const song = interaction.content.split('play')[1]
      console.log(song)



      const playerManager = new PlayerManager();
      const player = playerManager.get(interaction.guild.id);



      interaction.reply(':fire:  Buscando, isso pode demorar....').then(msg => setTimeout(() => { msg.delete() }, 2000));

      const searchResults = await player.search(song, {
        source: "spotify",

      });

      console.log(searchResults)



      if (searchResults.length && searchResults[0].tracks.length) {

        await player.play({
          channel: interaction.member.voice.channel,
          tracks: searchResults[0].tracks,
        });



        return await interaction.reply({ content: `:loud_sound:  | Tocando agora !` });
      }


    }




  });


  client.login(process.env.TOKEN);
  res.status(200).json({ name: 'John Doe' })
}
