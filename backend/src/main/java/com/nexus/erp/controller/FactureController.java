package com.nexus.erp.controller;

import com.nexus.erp.model.tenant.Facture;
import com.nexus.erp.service.FacturationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/erp/facturation")
@CrossOrigin(origins = "*")
public class FactureController {

    @Autowired
    private FacturationService facturationService;

    @GetMapping("/factures")
    public ResponseEntity<List<Facture>> getFactures(@RequestParam(defaultValue = "societe_demo") String tenantId) {
        return ResponseEntity.ok(facturationService.getFactures(tenantId));
    }

    @PostMapping("/factures")
    public ResponseEntity<Facture> genererFacture(@RequestParam(defaultValue = "societe_demo") String tenantId,
                                                   @RequestBody Map<String, Object> body) {
        String num = (String) body.get("numeroFacture");
        Double montant = Double.valueOf(body.get("montantTotal").toString());
        Facture f = facturationService.genererFacture(tenantId, num, montant);
        return ResponseEntity.ok(f);
    }

    @PostMapping("/factures/{id}/payer")
    public ResponseEntity<?> payerFacture(@PathVariable Long id,
                                           @RequestParam(defaultValue = "societe_demo") String tenantId,
                                           @RequestBody Map<String, Object> body) {
        String mode = (String) body.getOrDefault("modePaiement", "CARTE");
        Double montant = Double.valueOf(body.get("montantRecu").toString());

        boolean ok = facturationService.payerFacture(tenantId, id, mode, montant);
        if (ok) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Paiement en ligne accepté avec succès !"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Montant insuffisant ou facture introuvable."));
        }
    }
}
