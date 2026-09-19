package com.nexus.erp.service;

import com.nexus.erp.model.tenant.Client;
import com.nexus.erp.model.tenant.Commande;
import com.nexus.erp.model.tenant.LigneCommande;
import com.nexus.erp.model.tenant.Produit;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class CommercialService {

    private final Map<String, List<Client>> tenantClients = new ConcurrentHashMap<>();
    private final Map<String, List<Commande>> tenantCommandes = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(100);

    public Client ajouterClient(String tenantId, String nom, String email, String tel, String adresse) {
        Client client = new Client();
        client.setId(idGenerator.incrementAndGet());
        client.setNomClient(nom);
        client.setEmail(email);
        client.setTelephone(tel);
        client.setAdresse(adresse);

        tenantClients.computeIfAbsent(tenantId.toLowerCase(), k -> new ArrayList<>()).add(client);
        return client;
    }

    public List<Client> getClients(String tenantId) {
        List<Client> clients = tenantClients.get(tenantId.toLowerCase());
        if (clients == null || clients.isEmpty()) {
            // Initialiser avec des données modèles pour la démo
            Client c1 = ajouterClient(tenantId, "Sonatrach SPA", "contact@sonatrach.dz", "+213 21 54 87 00", "Hydra, Alger");
            Client c2 = ajouterClient(tenantId, "Cevital Agro", "achats@cevital.com", "+213 34 21 15 00", "Béjaïa, Algérie");
            return Arrays.asList(c1, c2);
        }
        return clients;
    }

    public Commande creerCommande(String tenantId, Long clientId, List<LigneCommande> lignes) {
        Commande commande = new Commande();
        commande.setId(idGenerator.incrementAndGet());
        commande.setDateCommande(LocalDate.now());
        commande.setStatut("BROUILLON");

        Client client = getClients(tenantId).stream()
                .filter(c -> c.getId().equals(clientId))
                .findFirst()
                .orElse(null);

        commande.setClient(client);

        if (lignes != null) {
            for (LigneCommande lc : lignes) {
                lc.setId(idGenerator.incrementAndGet());
                lc.setCommande(commande);
                commande.getLignesCommande().add(lc);
            }
        }

        commande.recalculerMontantTotal();
        tenantCommandes.computeIfAbsent(tenantId.toLowerCase(), k -> new ArrayList<>()).add(commande);
        return commande;
    }

    public List<Commande> getCommandes(String tenantId) {
        List<Commande> commandes = tenantCommandes.get(tenantId.toLowerCase());
        if (commandes == null || commandes.isEmpty()) {
            List<Client> clients = getClients(tenantId);
            Client client = clients.isEmpty() ? null : clients.get(0);

            Commande cmd = new Commande();
            cmd.setId(idGenerator.incrementAndGet());
            cmd.setDateCommande(LocalDate.now().minusDays(2));
            cmd.setStatut("VALIDEE");
            cmd.setClient(client);
            cmd.setMontantTotal(245000.0);

            tenantCommandes.computeIfAbsent(tenantId.toLowerCase(), k -> new ArrayList<>()).add(cmd);
            return List.of(cmd);
        }
        return commandes;
    }

    public Commande validerCommande(String tenantId, Long commandeId) {
        List<Commande> list = getCommandes(tenantId);
        for (Commande cmd : list) {
            if (cmd.getId().equals(commandeId)) {
                cmd.validerCommande();
                return cmd;
            }
        }
        throw new IllegalArgumentException("Commande non trouvée ID: " + commandeId);
    }
}
