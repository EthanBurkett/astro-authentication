import type { IDiscordUser } from "./models/DiscordUser.model";

export default {
  GetAvatarUrl: async (
    discordId: string,
    discordAvatar: string,
  ): Promise<string> => {
    let ext = "gif";
    let res = await fetch(
      `https://cdn.discordapp.com/avatars/${discordId}/${discordAvatar}.${ext}`,
    ).catch(() => null);
    if (!res || res.status !== 200) ext = "png";

    return `https://cdn.discordapp.com/avatars/${discordId}/${discordAvatar}.${ext}`;
  },
};
