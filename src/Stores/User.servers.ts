import { atom } from "nanostores";
import type { IServer } from "../lib/models/Server.model";

export const useServers = atom<IServer[]>([]);
