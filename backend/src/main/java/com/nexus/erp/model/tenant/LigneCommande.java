package com.nexus.erp.model.tenant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ligne_commande")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LigneCommande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantite;

    private Double prixUnitaireLigne;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commande_id")
    private Commande commande;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_id")
    private Produit produit;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }

    public Double getPrixUnitaireLigne() { return prixUnitaireLigne; }
    public void setPrixUnitaireLigne(Double prixUnitaireLigne) { this.prixUnitaireLigne = prixUnitaireLigne; }

    public Commande getCommande() { return commande; }
    public void setCommande(Commande commande) { this.commande = commande; }

    public Produit getProduit() { return produit; }
    public void setProduit(Produit produit) { this.produit = produit; }

    public Double calculerSousTotal() {
        if (prixUnitaireLigne == null) {
            return 0.0;
        }
        return quantite * prixUnitaireLigne;
    }
}
