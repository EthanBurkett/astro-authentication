import uniqid from "uniqid";
import { Buffer } from "buffer";
import type { IDiscordUser } from "../models/DiscordUser.model";

const clientId = import.meta.env.DISCORD_CLIENT_ID;
const clientOAuthSecret = import.meta.env.DISCORD_OAUTH_CLIENT_SECRET;
const redirectUri = import.meta.env.DISCORD_OAUTH_REDIRECT_URI;

export default {
  generateState: () => {
    return crypto.randomUUID();
  },
  generateVerifier: () => {
    return uniqid();
  },
  generateOAuthURL: (state: string, verifier: string) => {
    return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&response_type=code&state=${state}&scope=identify email guilds`;
  },
  getUser: async (token: string): Promise<IDiscordUser> => {
    const res = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  },
  getTokens: async (
    code: string,
    state: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> => {
    const res = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientOAuthSecret}`,
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        state,
      }),
    });

    return await res.json();
  },
};
