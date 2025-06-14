import useToastStore, { ToastsTypes } from "../stores/ErrorStore";

export async function encrypt(text: string, password: string): Promise<string> {
    const encoder = new TextEncoder();

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const keyMaterial = await getKeyMaterial(password);
    const key = await deriveKey(keyMaterial, salt);

    const encryptedContent = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encoder.encode(text)
    );

    const encryptedBytes = new Uint8Array([
        ...salt,
        ...iv,
        ...new Uint8Array(encryptedContent)
    ]);

    return btoa(String.fromCharCode(...encryptedBytes));
}

export async function decrypt(encrypted: string, password: string): Promise<
    { ok:true, value: string} |
    { ok: false, error: encryptErrors } |
    undefined
> {
    try {
        const data = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    
        const salt = data.slice(0, 16);
        const iv = data.slice(16, 28);
        const ciphertext = data.slice(28);
    
        const keyMaterial = await getKeyMaterial(password);
        const key = await deriveKey(keyMaterial, salt);
    
        const decryptedContent = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            ciphertext
        );
    
        const decoder = new TextDecoder();
        return {ok: true, value: decoder.decode(decryptedContent)};
    } catch (error) {
        const addToast = useToastStore.getState().addToast;

        if (error instanceof DOMException && error.name === "OperationError") {
            return {ok: false, error: encryptErrors.DECRYPTION_FAILED};
        }

        addToast({
            id: Math.random(),
            message: "Decryption failed. Please check your password.",
            type: ToastsTypes.error,
            timestamp: Date.now()
        });
        return undefined;
    }
}

export enum encryptErrors {
    GENERIC_ERROR = 1,
    DECRYPTION_FAILED = 2,
}

async function getKeyMaterial(password: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    return crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );
}

async function deriveKey(keyMaterial: CryptoKey, salt: Uint8Array): Promise<CryptoKey> {
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}
