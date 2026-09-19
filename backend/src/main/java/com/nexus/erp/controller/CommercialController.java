package com.nexus.erp.controller;

import com.nexus.erp.model.tenant.Client;
import com.nexus.erp.model.tenant.Commande;
import com.nexus.erp.service.CommercialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/erp/commercial")
@CrossOrigin(origins = "*")
public class CommercialController {

    @Autowired
    private CommercialService commercialService;

    @GetMapping("/clients")
    public ResponseEntity<List<Client>> getClients(@RequestParam(defaultValue = "societe_demo") String tenantId) {
        return ResponseEntity.ok(commercialService.getClients(tenantId));
    }

    @PostMapping("/clients")
    public ResponseEntity<Client> ajouterClient(@RequestParam(defaultValue = "societe_demo") String tenantId,
                                                @RequestBody Map<String, String> body) {
        Client c = commercialService.ajouterClient(
                tenantId,
                body.get("nomClient"),
                body.get("email"),
                body.get("telephone"),
                body.get("adresse")
        );
        return ResponseEntity.ok(c);
    }

    @GetMapping("/commandes")
    public ResponseEntity<List<Commande>> getCommandes(@RequestParam(defaultValue = "societe_demo") String tenantId) {
        return ResponseEntity.ok(commercialService.getCommandes(tenantId));
    }

    @PostMapping("/commandes/{id}/valider")
    public ResponseEntity<Commande> validerCommande(@PathVariable Long id,
                                                    @RequestParam(defaultValue = "societe_demo") String tenantId) {
        return ResponseEntity.ok(commercialService.validerCommande(tenantId, id));
    }
}
