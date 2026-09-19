package com.nexus.erp.model.tenant;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permission")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nomPermission;

    private String moduleAssocie;

    public boolean verifierAcces(String moduleDemande, String action) {
        if (this.moduleAssocie == null || this.nomPermission == null) {
            return false;
        }
        return this.moduleAssocie.equalsIgnoreCase(moduleDemande) &&
                this.nomPermission.toLowerCase().contains(action.toLowerCase());
    }
}
