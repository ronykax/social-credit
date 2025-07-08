import { AttachmentBuilder } from "discord.js";
import path from "path";

export default function getAttachment(name: string) {
    const attachment = new AttachmentBuilder(
        path.join(process.cwd(), "static", name)
    ).setName(`${name}`);

    return { attachment, url: `attachment://${name}` };
}
