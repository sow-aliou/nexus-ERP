package com.nexus.erp.model.tenant;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "facture")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numeroFacture;

    private LocalDate dateEmission;

    private Double montantTotal;

    private String codeQr;

    @OneToOne(mappedBy = "facture")
    private Commande commande;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNumeroFacture() { return numeroFacture; }
    public void setNumeroFacture(String numeroFacture) { this.numeroFacture = numeroFacture; }

    public LocalDate getDateEmission() { return dateEmission; }
    public void setDateEmission(LocalDate dateEmission) { this.dateEmission = dateEmission; }

    public Double getMontantTotal() { return montantTotal; }
    public void setMontantTotal(Double montantTotal) { this.montantTotal = montantTotal; }

    public String getCodeQr() { return codeQr; }
    public void setCodeQr(String codeQr) { this.codeQr = codeQr; }

    public Commande getCommande() { return commande; }
    public void setCommande(Commande commande) { this.commande = commande; }

    public void genererFactureElectronique(String numeroFacture, Double montant) {
        this.numeroFacture = numeroFacture;
        this.dateEmission = LocalDate.now();
        this.montantTotal = montant;
        this.codeQr = "QR_" + numeroFacture + "_" + montant;
    }

    public boolean traiterPaiementEnLigne(String modePaiement, Double montantRecu) {
        if (montantRecu != null && this.montantTotal != null && montantRecu >= this.montantTotal) {
            return true;
        }
        return false;
    }
}
