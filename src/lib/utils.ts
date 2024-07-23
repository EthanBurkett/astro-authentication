import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface IMinecraftPlayer {
  level: number;
  displayName: string;
  ip: string;
  name: string;
  health: number;
  maxHealth: number;
  location: {
    x: number;
    y: number;
    z: number;
  };
  foodLevel: number;
  exp: number;
  uuid: string;
  gamemode: "SURVIVAL" | "CREATIVE" | "ADVENTURE" | "SPECTATOR";
}
export interface IServerData {
  maxPlayers: number;
  onlinePlayers: number;
  port: number;
  players: IMinecraftPlayer[];
  name: string;
  version: string;
}

export interface IResponse<T> {
  data?: T;
  error?: {
    message: string;
    detailed: any;
  };
}

export const Fetch = async <T>({
  url,
  headers,
  method = "GET",
  body,
  revalidate = 1,
}: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: { [key: string]: string };
  body?: Record<string, any>;
  revalidate?: number;
}): Promise<IResponse<T>> => {
  try {
    const response = (await fetch(url, {
      method: method ? method : "GET",
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        ...headers,
      },
    })
      .then(async (d) => {
        const data = await d.json();
        if (data.error) throw new Error(data.error);
        return {
          data,
        };
      })
      .catch((e) => {
        return {
          error: {
            message: e.message,
            detailed: e,
          },
        };
      })) as IResponse<T>;

    return response;
  } catch (e: any) {
    return {
      error: {
        message: e.message,
        detailed: e,
      },
    };
  }
};
