package com.nexus.erp.service;

import com.nexus.erp.model.tenant.Produit;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class StockService {

    private final Map<String, List<Produit>> tenantProduits = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(200);

    public Produit ajouterProduit(String tenantId, String sku, String nom, Double prix, int stock) {
        Produit p = new Produit();
        p.setId(idGenerator.incrementAndGet());
        p.setCodeSku(sku);
        p.setNomProduit(nom);
        p.setPrixUnitaire(prix);
        p.setQuantiteStock(stock);

        tenantProduits.computeIfAbsent(tenantId.toLowerCase(), k -> new ArrayList<>()).add(p);
        return p;
    }

    public List<Produit> getProduits(String tenantId) {
        List<Produit> produits = tenantProduits.get(tenantId.toLowerCase());
        if (produits == null || produits.isEmpty()) {
            Produit p1 = ajouterProduit(tenantId, "SKU-SER-001", "Serveur Cloud Rack 2U Enterprise", 450000.0, 15);
            Produit p2 = ajouterProduit(tenantId, "SKU-LIC-002", "Licence SaaS ERP Annuelle", 120000.0, 100);
            Produit p3 = ajouterProduit(tenantId, "SKU-ECR-003", "Écran Professionnel 4K 27 pouces", 65000.0, 4); // Stock bas
            return Arrays.asList(p1, p2, p3);
        }
        return produits;
    }

    public Produit ajusterStock(String tenantId, Long produitId, int variation) {
        List<Produit> list = getProduits(tenantId);
        for (Produit p : list) {
            if (p.getId().equals(produitId)) {
                p.mettreAJourStock(variation);
                return p;
            }
        }
        throw new IllegalArgumentException("Produit non trouvé ID: " + produitId);
    }
}
