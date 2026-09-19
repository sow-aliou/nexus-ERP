package com.nexus.erp.security.crypto;

import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AesGcmEncryptionService {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int AES_KEY_SIZE = 256;
    private static final int GCM_IV_LENGTH = 12; // 96-bit IV
    private static final int GCM_TAG_LENGTH = 128; // 128-bit authentication tag

    private final SecureRandom secureRandom = new SecureRandom();
    private final SecretKey masterKey;
    private final Map<String, SecretKey> tenantKeys = new ConcurrentHashMap<>();

    public AesGcmEncryptionService() {
        this.masterKey = generateSecretKey();
    }

    public SecretKey generateSecretKey() {
        try {
            KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            keyGen.init(AES_KEY_SIZE, secureRandom);
            return keyGen.generateKey();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la generation de la cle AES-256", e);
        }
    }

    public SecretKey getOrCreateTenantKey(String tenantId) {
        return tenantKeys.computeIfAbsent(tenantId, id -> generateSecretKey());
    }

    public String encryptWithMasterKey(String plainText) {
        return encrypt(plainText, masterKey);
    }

    public String decryptWithMasterKey(String cipherText) {
        return decrypt(cipherText, masterKey);
    }

    public String encryptWithTenantKey(String plainText, String tenantId) {
        SecretKey tenantKey = getOrCreateTenantKey(tenantId);
        return encrypt(plainText, tenantKey);
    }

    public String decryptWithTenantKey(String cipherText, String tenantId) {
        SecretKey tenantKey = getOrCreateTenantKey(tenantId);
        return decrypt(cipherText, tenantKey);
    }

    private String encrypt(String plainText, SecretKey key) {
        try {
            byte[] iv = new byte[GCM_IV_LENGTH];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, key, parameterSpec);

            byte[] cipherText = cipher.doFinal(plainText.getBytes("UTF-8"));

            byte[] cipherTextWithIv = new byte[GCM_IV_LENGTH + cipherText.length];
            System.arraycopy(iv, 0, cipherTextWithIv, 0, GCM_IV_LENGTH);
            System.arraycopy(cipherText, 0, cipherTextWithIv, GCM_IV_LENGTH, cipherText.length);

            return Base64.getEncoder().encodeToString(cipherTextWithIv);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du chiffrement AES-256-GCM", e);
        }
    }

    private String decrypt(String encryptedTextWithIvBase64, SecretKey key) {
        try {
            byte[] cipherTextWithIv = Base64.getDecoder().decode(encryptedTextWithIvBase64);

            if (cipherTextWithIv.length < GCM_IV_LENGTH) {
                throw new IllegalArgumentException("Texte chiffre invalide (taille insuffisante)");
            }

            byte[] iv = new byte[GCM_IV_LENGTH];
            System.arraycopy(cipherTextWithIv, 0, iv, 0, GCM_IV_LENGTH);

            byte[] cipherText = new byte[cipherTextWithIv.length - GCM_IV_LENGTH];
            System.arraycopy(cipherTextWithIv, GCM_IV_LENGTH, cipherText, 0, cipherText.length);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, key, parameterSpec);

            byte[] plainTextBytes = cipher.doFinal(cipherText);
            return new String(plainTextBytes, "UTF-8");
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du dechiffrement AES-256-GCM", e);
        }
    }
}
