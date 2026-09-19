package com.nexus.erp.model.central;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "journal_audit_global")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JournalAuditGlobal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;

    private String adresseIp;

    private LocalDateTime horodatage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;

    public void enregistrerEvenementSysteme(String actionDetails, String ip) {
        this.action = actionDetails;
        this.adresseIp = ip;
        this.horodatage = LocalDateTime.now();
    }
}
