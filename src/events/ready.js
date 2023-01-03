module.exports = function Ready(events) {
  return client.once(events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
  });
};
