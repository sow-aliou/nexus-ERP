package com.nexus.erp.controller;

import com.nexus.erp.security.crypto.AesGcmEncryptionService;
import com.nexus.erp.security.crypto.PasswordHashService;
import com.nexus.erp.service.OtpService;
import com.nexus.erp.service.TrialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthRestController {

    @Autowired
    private PasswordHashService passwordHashService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private TrialService trialService;

    @Autowired
    private AesGcmEncryptionService aesGcmEncryptionService;

    private static final Map<String, Map<String, Object>> registeredUsers = new HashMap<>();

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String nom = request.get("nom");
        String prenom = request.get("prenom");
        String nomEntreprise = request.get("nomEntreprise");
        String rawPassword = request.get("password");
        String typeSouscription = request.getOrDefault("typeSouscription", "ESSAI"); // "ESSAI" ou "PAYANT"

        if (email == null || rawPassword == null || nomEntreprise == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email, nom d'entreprise et mot de passe requis"));
        }

        String passwordHash = passwordHashService.hashPassword(rawPassword);
        String tenantId = "societe_" + nomEntreprise.toLowerCase().replaceAll("[^a-z0-9]", "");

        Map<String, Object> userData = new HashMap<>();
        userData.put("email", email);
        userData.put("nom", nom);
        userData.put("prenom", prenom);
        userData.put("nomEntreprise", nomEntreprise);
        userData.put("tenantId", tenantId);
        userData.put("passwordHash", passwordHash);
        userData.put("typeSouscription", typeSouscription);
        userData.put("verified", false);

        registeredUsers.put(email.toLowerCase(), userData);

        // Génération de l'OTP
        String otpCode = otpService.generateOtp(email);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Inscription enregistrée. Un code de vérification OTP à 6 chiffres a été envoyé à " + email);
        response.put("email", email);
        response.put("tenantId", tenantId);
        response.put("debugOtp", otpCode); // Pour faciliter la simulation et la démo

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otpCode = request.get("codeOtp");

        if (email == null || otpCode == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email et code OTP requis"));
        }

        try {
            boolean isValid = otpService.verifyOtp(email, otpCode);
            if (isValid) {
                Map<String, Object> userData = registeredUsers.get(email.toLowerCase());
                if (userData != null) {
                    userData.put("verified", true);
                }

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Adresse e-mail vérifiée avec succès. Compte pleinement actif !");
                response.put("email", email);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Code OTP incorrect. Veuillez réessayer."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email requis"));
        }
        try {
            String newOtp = otpService.generateOtp(email);
            return ResponseEntity.ok(Map.of(
                    "message", "Un nouveau code OTP a été envoyé à " + email,
                    "debugOtp", newOtp
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String rawPassword = request.get("password");

        if (email == null || rawPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email et mot de passe requis"));
        }

        Map<String, Object> userData = registeredUsers.get(email.toLowerCase());

        // Compte de démonstration pré-configuré si non trouvé
        if (userData == null && "demo@nexus-erp.com".equalsIgnoreCase(email)) {
            userData = new HashMap<>();
            userData.put("email", email);
            userData.put("nom", "Admin");
            userData.put("prenom", "Demo");
            userData.put("nomEntreprise", "Nexus Demo Corp");
            userData.put("tenantId", "societe_demo");
            userData.put("passwordHash", passwordHashService.hashPassword("demo123"));
            userData.put("typeSouscription", "ESSAI");
            userData.put("verified", true);
            registeredUsers.put(email.toLowerCase(), userData);
        }

        if (userData == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Identifiants invalides"));
        }

        boolean isVerified = Boolean.TRUE.equals(userData.get("verified"));
        if (!isVerified) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Veuillez vérifier votre adresse e-mail via le code OTP avant de vous connecter."));
        }

        String storedHash = (String) userData.get("passwordHash");
        if (!passwordHashService.verifyPassword(rawPassword, storedHash)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Mot de passe incorrect"));
        }

        String tenantId = (String) userData.get("tenantId");
        String typeSouscription = (String) userData.getOrDefault("typeSouscription", "ESSAI");

        int remainingVisits = 30;
        int currentVisit = 1;

        if ("ESSAI".equalsIgnoreCase(typeSouscription)) {
            try {
                currentVisit = trialService.recordVisit(tenantId);
                remainingVisits = trialService.getRemainingVisits(tenantId);
            } catch (IllegalStateException e) {
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(Map.of(
                        "error", e.getMessage(),
                        "trialExpired", true,
                        "tenantId", tenantId,
                        "canExportData", true
                ));
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("token", "jwt_token_" + System.currentTimeMillis());
        response.put("email", email);
        response.put("nomEntreprise", userData.get("nomEntreprise"));
        response.put("tenantId", tenantId);
        response.put("typeSouscription", typeSouscription);
        response.put("currentVisit", currentVisit);
        response.put("remainingVisits", remainingVisits);
        response.put("trialExpired", false);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/tenant/export-data")
    public ResponseEntity<?> exportTenantData(@RequestParam String tenantId) {
        Map<String, Object> exportedData = new HashMap<>();
        exportedData.put("tenantId", tenantId);
        exportedData.put("exportedAt", java.time.LocalDateTime.now().toString());
        exportedData.put("status", "SUCCESS");
        exportedData.put("message", "Données du tenant " + tenantId + " exportées de manière sécurisée.");
        exportedData.put("modules", Map.of(
                "commercial", Map.of("clientsCount", 12, "commandesCount", 45),
                "achats", Map.of("fournisseursCount", 5, "commandesAchatCount", 18),
                "stocks", Map.of("produitsCount", 120, "valeurStockTotal", 45600.0)
        ));

        return ResponseEntity.ok(exportedData);
    }
}
