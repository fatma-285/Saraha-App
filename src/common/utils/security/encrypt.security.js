import crypto from 'node:crypto';

//! Symmetric Encryption 

// 🔑 Use 32 bytes (256 bits) for AES-256
const ENCRYPTION_KEY = Buffer.from("12W456789Uhs4567891234LkJ8912Ps5"); 
const IV_LENGTH = 16; // For AES, the IV is always 16 bytes

export function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);  

    let encrypted = cipher.update(text, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
}


// Decrypt function
export function decrypt(text) {

    const [ivHex, encryptedText] = text.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');    

    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY , iv);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
}

//! Asymmetric Encryption

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    }
});

export function encryptAsymmetric(text) {

    const buffer = Buffer.from(text);
    const encrypted = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        },
        buffer
    );
    return encrypted.toString('hex')
}

export function decryptAsymmetric(encryptedText) {    
    const buffer = Buffer.from(encryptedText, 'hex');    
    const decrypted = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        },
        buffer
    );    
    return decrypted.toString('utf-8');
}
