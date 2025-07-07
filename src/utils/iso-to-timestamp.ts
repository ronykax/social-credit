export default function timestamp(iso: string, format: string = "f"): string {
    const unix = Math.floor(new Date(iso).getTime() / 1000);
    return `<t:${unix}:${format}>`;
}
