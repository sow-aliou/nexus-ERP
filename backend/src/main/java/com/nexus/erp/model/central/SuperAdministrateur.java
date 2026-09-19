package com.nexus.erp.model.central;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "super_administrateur")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuperAdministrateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String motDePasseHash;

    @OneToMany(mappedBy = "superAdministrateur", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Entreprise> entreprises = new ArrayList<>();

    public void superviseSysteme() {
        // Logique de supervision globale du SaaS
    }

    public void gererEntreprises() {
        // Logique de gestion des entreprises inscrites
    }

    public void auditerSysteme() {
        // Logique d'audit système global
    }
}
