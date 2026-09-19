package com.nexus.erp.model.central;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "abonnement")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Abonnement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String typePlan;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    private String statutPaiement;

    private Double montant;

    @OneToOne(mappedBy = "abonnement")
    private Entreprise entreprise;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTypePlan() { return typePlan; }
    public void setTypePlan(String typePlan) { this.typePlan = typePlan; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public String getStatutPaiement() { return statutPaiement; }
    public void setStatutPaiement(String statutPaiement) { this.statutPaiement = statutPaiement; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public Entreprise getEntreprise() { return entreprise; }
    public void setEntreprise(Entreprise entreprise) { this.entreprise = entreprise; }

    public void renouvelerAbonnement(int moisSupplementaires) {
        if (this.dateFin == null) {
            this.dateFin = LocalDate.now();
        }
        this.dateFin = this.dateFin.plusMonths(moisSupplementaires);
        this.statutPaiement = "PAYE";
    }

    public boolean verifierExpiration() {
        if (this.dateFin == null) {
            return true;
        }
        return LocalDate.now().isAfter(this.dateFin);
    }
}
