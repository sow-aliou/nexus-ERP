package com.nexus.erp.model.tenant;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "role")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nomRole;

    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "role_permissions",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    @Builder.Default
    private List<Permission> permissions = new ArrayList<>();

    @OneToMany(mappedBy = "role")
    @Builder.Default
    private List<UtilisateurEntreprise> utilisateurs = new ArrayList<>();

    public void attribuerAUtilisateur(UtilisateurEntreprise utilisateur) {
        if (utilisateur != null) {
            utilisateur.setRole(this);
            if (!this.utilisateurs.contains(utilisateur)) {
                this.utilisateurs.add(utilisateur);
            }
        }
    }
}
