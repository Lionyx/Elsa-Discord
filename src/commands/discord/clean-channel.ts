import { TextChannel } from 'discord.js';
import Command from '../../command';
import Context from '../../context';

const channelsNeedingConfirmation: Set<string> = new Set();

class CleanChannel extends Command {
  private static readonly CONFIRMATION_TIMEOUT = 15000;

  async execute({ bot, message, args }: Context): Promise<void> {
    const channel = bot.client.channels.cache.get(args) as TextChannel;
    if (!channel || !(channel instanceof TextChannel)) {
      await message.reply('Please mention a channel.');
      return;
    }
    if (!channelsNeedingConfirmation.has(channel.id)) {
      await message.reply(`Are you sure you want to clean ${channel.name}?` +
        'If so, redo the command.');
      channelsNeedingConfirmation.add(channel.id);
      setTimeout(() => {
        channelsNeedingConfirmation.delete(channel.id);
      }, CleanChannel.CONFIRMATION_TIMEOUT);
      return;
    }
    channelsNeedingConfirmation.delete(channel.id);
    const messages = await channel.messages.fetch({ limit: 100 });
    await channel.bulkDelete(messages);
    await message.reply(`Deleted ${messages.size} messages.`);
  }

  name(): string {
    return 'clean-channel';
  }

  override isMaintainerOnly(): boolean {
    return true;
  }

  override description(): string {
    return 'Deletes all messages in a channel.';
  }
}

export default {
  commands: [CleanChannel]
};
