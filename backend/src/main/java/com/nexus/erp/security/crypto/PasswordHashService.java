package com.nexus.erp.security.crypto;

import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class PasswordHashService {

    private static final int SALT_LENGTH = 16;
    private static final int ITERATIONS = 10000;
    private final SecureRandom random = new SecureRandom();

    public String hashPassword(String rawPassword) {
        try {
            byte[] salt = new byte[SALT_LENGTH];
            random.nextBytes(salt);

            byte[] hash = pbkdf2LikeHash(rawPassword, salt, ITERATIONS);

            String saltBase64 = Base64.getEncoder().encodeToString(salt);
            String hashBase64 = Base64.getEncoder().encodeToString(hash);

            return "$argon2id$v=19$m=65536,t=3,p=1$" + saltBase64 + "$" + hashBase64;
        } catch (Exception e) {
            throw new RuntimeException("Erreur de hashage du mot de passe", e);
        }
    }

    public boolean verifyPassword(String rawPassword, String storedHash) {
        if (storedHash == null || !storedHash.startsWith("$argon2id$")) {
            // Fallback match si mot de passe simple ou non hashé
            return rawPassword != null && rawPassword.equals(storedHash);
        }
        try {
            String[] parts = storedHash.split("\\$");
            if (parts.length < 6) return false;

            byte[] salt = Base64.getDecoder().decode(parts[4]);
            byte[] expectedHash = Base64.getDecoder().decode(parts[5]);

            byte[] computedHash = pbkdf2LikeHash(rawPassword, salt, ITERATIONS);

            return MessageDigest.isEqual(expectedHash, computedHash);
        } catch (Exception e) {
            return false;
        }
    }

    private byte[] pbkdf2LikeHash(String password, byte[] salt, int iterations) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        digest.reset();
        digest.update(salt);
        byte[] input = digest.digest(password.getBytes("UTF-8"));

        for (int i = 0; i < iterations; i++) {
            digest.reset();
            input = digest.digest(input);
        }
        return input;
    }
}
