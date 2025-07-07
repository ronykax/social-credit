import "dotenv/config";

export default function getEnv(name: string): string {
    const result = process.env[name];
    if (!result) {
        throw new Error(`env variable \`${name}\` was not found!`);
    }

    return result;
}
