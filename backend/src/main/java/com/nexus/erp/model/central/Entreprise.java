package com.nexus.erp.model.central;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "entreprise")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Entreprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomEntreprise;

    @Column(nullable = false, unique = true)
    private String identifiantUnique;

    @Column(nullable = false)
    private String nomBaseDeDonnees;

    private String statutAbonnement;

    private LocalDate dateFinEssai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "super_administrateur_id")
    private SuperAdministrateur superAdministrateur;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "abonnement_id", referencedColumnName = "id")
    private Abonnement abonnement;

    @OneToMany(mappedBy = "entreprise", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<JournalAuditGlobal> journauxAuditGlobal = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomEntreprise() { return nomEntreprise; }
    public void setNomEntreprise(String nomEntreprise) { this.nomEntreprise = nomEntreprise; }

    public String getIdentifiantUnique() { return identifiantUnique; }
    public void setIdentifiantUnique(String identifiantUnique) { this.identifiantUnique = identifiantUnique; }

    public String getNomBaseDeDonnees() { return nomBaseDeDonnees; }
    public void setNomBaseDeDonnees(String nomBaseDeDonnees) { this.nomBaseDeDonnees = nomBaseDeDonnees; }

    public String getStatutAbonnement() { return statutAbonnement; }
    public void setStatutAbonnement(String statutAbonnement) { this.statutAbonnement = statutAbonnement; }

    public LocalDate getDateFinEssai() { return dateFinEssai; }
    public void setDateFinEssai(LocalDate dateFinEssai) { this.dateFinEssai = dateFinEssai; }

    public SuperAdministrateur getSuperAdministrateur() { return superAdministrateur; }
    public void setSuperAdministrateur(SuperAdministrateur superAdministrateur) { this.superAdministrateur = superAdministrateur; }

    public Abonnement getAbonnement() { return abonnement; }
    public void setAbonnement(Abonnement abonnement) { this.abonnement = abonnement; }

    public List<JournalAuditGlobal> getJournauxAuditGlobal() { return journauxAuditGlobal; }
    public void setJournauxAuditGlobal(List<JournalAuditGlobal> journauxAuditGlobal) { this.journauxAuditGlobal = journauxAuditGlobal; }

    public void activerEntreprise() {
        this.statutAbonnement = "ACTIF";
    }

    public void suspendreEntreprise() {
        this.statutAbonnement = "SUSPENDU";
    }

    public void provisionnerBaseDeDonnees() {
        if (this.identifiantUnique != null && !this.identifiantUnique.isEmpty()) {
            this.nomBaseDeDonnees = "societe_" + this.identifiantUnique.toLowerCase();
        }
    }
}
