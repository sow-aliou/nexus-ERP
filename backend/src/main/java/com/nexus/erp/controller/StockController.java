package com.nexus.erp.controller;

import com.nexus.erp.model.tenant.Produit;
import com.nexus.erp.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/erp/stock")
@CrossOrigin(origins = "*")
public class StockController {

    @Autowired
    private StockService stockService;

    @GetMapping("/produits")
    public ResponseEntity<List<Produit>> getProduits(@RequestParam(defaultValue = "societe_demo") String tenantId) {
        return ResponseEntity.ok(stockService.getProduits(tenantId));
    }

    @PostMapping("/produits")
    public ResponseEntity<Produit> ajouterProduit(@RequestParam(defaultValue = "societe_demo") String tenantId,
                                                   @RequestBody Map<String, Object> body) {
        String sku = (String) body.get("codeSku");
        String nom = (String) body.get("nomProduit");
        Double prix = Double.valueOf(body.get("prixUnitaire").toString());
        int stock = Integer.parseInt(body.get("quantiteStock").toString());

        Produit p = stockService.ajouterProduit(tenantId, sku, nom, prix, stock);
        return ResponseEntity.ok(p);
    }

    @PostMapping("/produits/{id}/ajuster")
    public ResponseEntity<Produit> ajusterStock(@PathVariable Long id,
                                                 @RequestParam(defaultValue = "societe_demo") String tenantId,
                                                 @RequestBody Map<String, Integer> body) {
        int variation = body.getOrDefault("variation", 0);
        return ResponseEntity.ok(stockService.ajusterStock(tenantId, id, variation));
    }
}
