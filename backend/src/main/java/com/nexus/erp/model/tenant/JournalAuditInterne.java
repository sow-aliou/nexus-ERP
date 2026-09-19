package com.nexus.erp.model.tenant;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "journal_audit_interne")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JournalAuditInterne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String operation;

    private String donneeConcernee;

    private LocalDateTime dateAction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id")
    private UtilisateurEntreprise utilisateur;

    public void tracerActionMetier(String operation, String donneeConcernee, UtilisateurEntreprise utilisateur) {
        this.operation = operation;
        this.donneeConcernee = donneeConcernee;
        this.utilisateur = utilisateur;
        this.dateAction = LocalDateTime.now();
    }
}
