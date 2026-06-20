export async function extractText(
  file: File,
  buffer: Buffer
) {
  try {
    return buffer.toString("utf-8");

  } catch (error) {
    console.log("Text extraction error:", error);

    return "";
  }
}