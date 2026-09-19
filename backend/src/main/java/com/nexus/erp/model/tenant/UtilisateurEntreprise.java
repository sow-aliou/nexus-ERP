package com.nexus.erp.model.tenant;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "utilisateur_entreprise")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UtilisateurEntreprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String prenom;

    private String nom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String motDePasseHash;

    private String codeOtp;

    private LocalDateTime expirationOtp;

    private boolean emailVerifie;

    private int compteurVisitesEssai;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToMany(mappedBy = "utilisateur", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<JournalAuditInterne> journauxAudit = new ArrayList<>();

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean seConnecter(String emailSaisi, String motDePasseSaisi) {
        return this.email != null && this.email.equalsIgnoreCase(emailSaisi) &&
                this.motDePasseHash != null && this.motDePasseHash.equals(motDePasseSaisi);
    }

    public boolean verifierOtp(String otpSaisi) {
        if (this.codeOtp == null || this.expirationOtp == null) {
            return false;
        }
        return this.codeOtp.equals(otpSaisi) && LocalDateTime.now().isBefore(this.expirationOtp);
    }

    public void incrementerCompteurEssai() {
        this.compteurVisitesEssai++;
    }

    public String exporterDonneesEntreprise() {
        // Logique d'exportation de l'espace de travail entreprise
        return "Donnees d'entreprise exportees pour " + this.email;
    }
}
