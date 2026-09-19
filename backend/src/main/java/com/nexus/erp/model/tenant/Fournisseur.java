package com.nexus.erp.model.tenant;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "fournisseur")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fournisseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomFournisseur;

    private String contact;

    private String detailsPaiement;

    @OneToMany(mappedBy = "fournisseur", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Produit> produits = new ArrayList<>();

    public void creerFournisseur(String nom, String contact, String detailsPaiement) {
        this.nomFournisseur = nom;
        this.contact = contact;
        this.detailsPaiement = detailsPaiement;
    }
}
