package com.nexus.erp.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final int EXPIRATION_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 3;

    private final SecureRandom random = new SecureRandom();
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    public static class OtpEntry {
        private final String code;
        private final LocalDateTime expiration;
        private int attempts;
        private LocalDateTime lastResend;

        public OtpEntry(String code, LocalDateTime expiration) {
            this.code = code;
            this.expiration = expiration;
            this.attempts = 0;
            this.lastResend = LocalDateTime.now();
        }

        public String getCode() { return code; }
        public LocalDateTime getExpiration() { return expiration; }
        public int getAttempts() { return attempts; }
        public void incrementAttempts() { this.attempts++; }
        public LocalDateTime getLastResend() { return lastResend; }
        public void setLastResend(LocalDateTime lastResend) { this.lastResend = lastResend; }
    }

    public String generateOtp(String email) {
        // Validation rate limiting anti-abus (attendre au moins 30s avant de renvoyer un code)
        OtpEntry existing = otpStore.get(email.toLowerCase());
        if (existing != null && existing.getLastResend().plusSeconds(30).isAfter(LocalDateTime.now())) {
            throw new IllegalStateException("Veuillez attendre 30 secondes avant de demander un nouveau code OTP.");
        }

        StringBuilder codeBuilder = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            codeBuilder.append(random.nextInt(10));
        }
        String otpCode = codeBuilder.toString();
        LocalDateTime expiration = LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES);

        otpStore.put(email.toLowerCase(), new OtpEntry(otpCode, expiration));

        // Envoi simulé / réel par e-mail (Dans les logs de prod l'OTP est masque)
        System.out.println("[SERVICE OTP] Code OTP généré pour " + email + ": " + otpCode);

        return otpCode;
    }

    public boolean verifyOtp(String email, String inputCode) {
        String key = email.toLowerCase();
        OtpEntry entry = otpStore.get(key);

        if (entry == null) {
            return false;
        }

        if (LocalDateTime.now().isAfter(entry.getExpiration())) {
            otpStore.remove(key);
            throw new IllegalArgumentException("Le code OTP a expire. Veuillez en demander un nouveau.");
        }

        if (entry.getAttempts() >= MAX_ATTEMPTS) {
            otpStore.remove(key);
            throw new IllegalStateException("Nombre maximal de tentatives atteint. Code OTP invalide.");
        }

        if (entry.getCode().equals(inputCode)) {
            otpStore.remove(key); // Invalidation immédiate après utilisation réussie
            return true;
        } else {
            entry.incrementAttempts();
            return false;
        }
    }

    public void invalidateOtp(String email) {
        otpStore.remove(email.toLowerCase());
    }
}
