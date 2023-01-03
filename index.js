const {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  ContextMenuCommandAssertions,
} = require("discord.js");

const { token } = require("./config.json");
const Ready = require("./src/events/ready.js");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const ffmpeg = require("ffmpeg");
const Connection = require("./src/voice/connected.js");
const {
  createAudioResource,
  createAudioPlayer,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: '',
  clientSecret: '',
  accessToken: ''
});

global.row = [];
global.playing = [];
global.queue = [];

global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
  presence: [Partials.Channel, Partials.Message],
});

Ready(Events);

client.on("messageCreate", async (interaction) => {
  const command = interaction.content.split(" ")[0];

  if (command === "!play") {


    const music = interaction.content.split("!play")[1];

    if (!music) return;
    const playType = music.split('/')



    if (playType[2] === 'open.spotify.com') {
      const connected = Connection(interaction);

      spotifyApi.getTrack(playType[4].split('?')[0])
        .then(async data => {
          interaction.reply('Buscando...')

          const track = data.body;

          const name = track.name;

          const filter = await ytsr.getFilters(name);
          const filter1 = filter.get("Type").get("Video");

          const searchResults = await ytsr(filter1.url, {
            limit: 3,
          });

          const url = searchResults.items[0].url;
          const stream = ytdl(url, {
            filter: "audioonly",
          });

          const player = createAudioPlayer();
          const resource = createAudioResource(stream);


          player.play(resource);
          global.playing.push(resource);
          connected.subscribe(player);
          interaction.reply(`Tocanndo agora **${name}**`)
        })


    } else {




      const filter = await ytsr.getFilters(music);
      const filter1 = filter.get("Type").get("Video");

      const searchResults = await ytsr(filter1.url, {
        limit: 3,
      });

      const url = searchResults.items[0].url;
      const stream = ytdl(url, {
        filter: "audioonly",
      });

      if (global.playing.length === 0) {
        const connected = Connection(interaction);
        const player = createAudioPlayer();
        const resource = createAudioResource(stream);

        player.play(resource);
        global.playing.push(resource);
        connected.subscribe(player);

        interaction.reply(`Tocando agora **${searchResults.items[0].title}** `);

        player.on("error", (error) => console.error(error));

        player.on(AudioPlayerStatus.Idle, () => {
          if (global.queue.length === 0) {
            return interaction.reply("Acabou");
          } else {
            player.play(global.queue[0]);
            global.playing.push(global.queue[0]);
            global.queue.splice(0, 1);
            return interaction.reply("Tem mais");
          }
        });
      } else {
        const resource = createAudioResource(stream);
        global.queue.push(resource);
        return interaction.reply("Adicionando a fila!");
      }
    }
  }
});

client.login(token);
