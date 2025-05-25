// filepath: s:/Code/portfolio-manager/lib/utils/encryption.ts
import crypto from "crypto";

// Encryption key (32 bytes in hex) stored in environment variable
const ENCRYPTION_KEY = process.env.API_KEY_ENCRYPTION_KEY;
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error(
    "Missing or invalid API_KEY_ENCRYPTION_KEY environment variable. It must be a 64-character hex string."
  );
}

const algorithm = "aes-256-gcm";
const key = Buffer.from(ENCRYPTION_KEY, "hex");

/**
 * Encrypts a plain text using AES-256-GCM.
 * Returns a string in the format iv:authTag:encryptedText (all hex).
 */
export function encryptText(plainText: string): string {
  const iv = crypto.randomBytes(12); // 96-bit nonce for GCM
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

/**
 * Decrypts a text encrypted by encryptText.
 * Expects input format iv:authTag:encryptedText (all hex).
 */
export function decryptText(encryptedData: string): string {
  const [ivHex, authTagHex, encryptedHex] = encryptedData.split(":");
  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Invalid encrypted data format.");
  }
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
