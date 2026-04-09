export const getApiConfig = () => ({
  encryptionEnabled: process.env.NEXT_PUBLIC_API_PAYLOAD_ENCRYPTION_ENABLED === "true",
  encryptionKeyHex: process.env.NEXT_PUBLIC_API_ENCRYPTION_KEY || "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  apiGatewayKey: process.env.NEXT_PUBLIC_API_GATEWAY_KEY || "",
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});

// Crypto Helpers
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function getCryptoKey(): Promise<CryptoKey> {
  const config = getApiConfig();
  let keyHex = config.encryptionKeyHex;
  if (keyHex.length !== 64) {
    keyHex = keyHex.padEnd(64, "0").substring(0, 64);
  }
  const keyBytes = hexToBytes(keyHex);

  return crypto.subtle.importKey(
    "raw",
    keyBytes.buffer as ArrayBuffer,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptPayload(data: unknown): Promise<string> {
  const textEncoded = new TextEncoder().encode(JSON.stringify(data));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getCryptoKey();

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    textEncoded,
  );

  const encryptedBytes = new Uint8Array(encryptedBuffer);

  const combined = new Uint8Array(iv.length + encryptedBytes.length);
  combined.set(iv, 0);
  combined.set(encryptedBytes, iv.length);

  return bytesToBase64(combined);
}

export async function decryptPayload(base64Payload: string): Promise<unknown> {
  let combinedBytes: Uint8Array;
  try {
    combinedBytes = base64ToBytes(base64Payload);
  } catch {
    throw new Error("Payload too short"); // Or invalid format
  }

  if (combinedBytes.length < 28) {
    throw new Error("Payload too short");
  }

  const iv = combinedBytes.slice(0, 12);
  const ciphertextAndTag = combinedBytes.slice(12);
  const key = await getCryptoKey();

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertextAndTag,
  );

  const decryptedText = new TextDecoder().decode(decryptedBuffer);
  return JSON.parse(decryptedText);
}

// Main API Client
export interface ApiOptions extends RequestInit {
  data?: unknown;
  skipDecryption?: boolean;
}

export async function apiClient(endpoint: string, options: ApiOptions = {}) {
  const config = getApiConfig();
  const {
    data,
    headers: customHeaders,
    skipDecryption = false,
    ...fetchOptions
  } = options;
  const url = `${config.baseUrl}${endpoint}`;

  const headers = new Headers(customHeaders);
  if (config.apiGatewayKey) {
    headers.set("x-api-gateway-key", config.apiGatewayKey);
  }

  headers.set("Content-Type", "application/json");

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  let body = fetchOptions.body;
  if (data) {
    if (config.encryptionEnabled) {
      // Backend expects {"payload": "base64_string"}
      const encryptedString = await encryptPayload(data);
      body = JSON.stringify({ payload: encryptedString });
    } else {
      body = JSON.stringify(data);
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    body,
  });

  let jsonResponse: unknown;

  try {
    const textResp = await response.text();
    if (textResp) {
      jsonResponse = JSON.parse(textResp);
    }
  } catch {
    jsonResponse = null;
  }

  // Handle transparent decryption first, so we can read encrypted error messages!
  if (
    config.encryptionEnabled &&
    !skipDecryption &&
    jsonResponse &&
    typeof jsonResponse === "object" &&
    "data" in jsonResponse &&
    typeof (jsonResponse as { data: unknown }).data === "string"
  ) {
    try {
      jsonResponse = await decryptPayload(
        (jsonResponse as { data: string }).data,
      );
    } catch {
      console.warn("Failed to decrypt payload. Keeping raw response.");
    }
  }

  if (!response.ok) {
    let errorMessage = response.statusText;
    if (jsonResponse && typeof jsonResponse === "object") {
      const res = jsonResponse as Record<string, unknown>;
      errorMessage =
        (res.error as string) ||
        (res.message as string) ||
        JSON.stringify(jsonResponse);
    }

    // Fallback for empty/missing error messages on 401
    if (
      response.status === 401 &&
      (!errorMessage ||
        errorMessage === "Unauthorized" ||
        errorMessage.includes('{"data"'))
    ) {
      errorMessage = "Authorization failed: invalid username/password";
    }

    throw new Error(errorMessage);
  }

  return jsonResponse;
}

export const api = {
  get: (endpoint: string, options?: ApiOptions) =>
    apiClient(endpoint, { ...options, method: "GET" }),
  post: (endpoint: string, data: unknown, options?: ApiOptions) =>
    apiClient(endpoint, { ...options, method: "POST", data }),
  patch: (endpoint: string, data: unknown, options?: ApiOptions) =>
    apiClient(endpoint, { ...options, method: "PATCH", data }),
  delete: (endpoint: string, options?: ApiOptions) =>
    apiClient(endpoint, { ...options, method: "DELETE" }),
};
