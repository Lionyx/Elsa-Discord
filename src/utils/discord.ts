import {Message, TextChannel} from 'discord.js';

// Credit : https://stackoverflow.com/questions/63322284/discord-js-get-an-array-of-all-messages-in-a-channel
export async function fetchAllMessages(channel: TextChannel): Promise<Message<boolean>[]> {
    const messages: Message<boolean>[] = [];

    // Create message pointer
    let msg = await channel.messages
      .fetch({ limit: 1 })
      .then(messagePage => (messagePage.size === 1 ? messagePage.at(0) : null));
    let keep = true;

    while (msg && keep) {
      await channel.messages
        .fetch({ limit: 100, before: msg.id })
        .then(messagePage => {
          messagePage.forEach(msg => messages.push(msg));
          // Update our message pointer to be last message in page of messages
          if (messages.length >= 350) {
            keep = false;
          }
          console.log('fetched 100 messages');
          msg = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
        });
    }

    console.log('returns '+ messages.length + ' messages');
    return messages;
}
