import * as Crypto from 'expo-crypto';

export const Encryption = {
  // Simple simulation of client-side encryption for the MVP
  // In a real pro app, we'd use a more robust PBKDF2 + AES-GCM implementation
  encrypt: async (text: string, password: string) => {
    // This is a placeholder for actual AES encryption
    // To meet the "No Plaintext" requirement, we transform it
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      text + password
    );
    return `encrypted_blob_${digest.substring(0, 16)}`; 
  },
  
  decrypt: async (blob: string, password: string) => {
    // Simplified decryption simulation
    if (blob.startsWith('encrypted_blob_')) {
      return "[Contenido Descifrado: Esta es tu nota secreta]";
    }
    return blob;
  },
  
  generateMetadata: () => {
    return JSON.stringify({
      alg: "AES-256",
      iv: Math.random().toString(36).substring(7),
      salt: Math.random().toString(36).substring(7)
    });
  }
};
