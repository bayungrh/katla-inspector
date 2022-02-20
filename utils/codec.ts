export default function decode(hash: string): string {
  const [equalSigns, ...chars] = hash.split("").reverse();
  const padding = "=".repeat(Number(equalSigns));
  const base64 =
    chars
      .reverse()
      .map((str, i) => {
        const charCode = str.charCodeAt(0) + (i % 2 === 0 ? -1 : 1);
        return String.fromCharCode(charCode);
      })
      .join("") + padding;
  return Buffer.from(base64, "base64").toString();
}
