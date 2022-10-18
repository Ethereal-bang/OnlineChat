export const decodeHtml = (str: string | undefined) => {
    return str
        ? str.replace(/<[^>]+>/g, "")
        : "";
}