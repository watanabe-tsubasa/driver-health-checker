export const hashPassword = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const verifyPassword = async (inputPassword: string, storedHash: string, salt: string): Promise<boolean> => {
  const hashedInput = await hashPassword(inputPassword, salt);
  return hashedInput === storedHash;
}
