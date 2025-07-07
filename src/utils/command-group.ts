import { Collection } from "discord.js";
import type { Command } from "./types";

const commandGroup = new Collection<string, Command>();
export default commandGroup;
