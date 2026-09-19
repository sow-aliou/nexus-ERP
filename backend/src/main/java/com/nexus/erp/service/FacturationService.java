package com.nexus.erp.service;

import com.nexus.erp.model.tenant.Facture;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class FacturationService {

    private final Map<String, List<Facture>> tenantFactures = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(300);

    public Facture genererFacture(String tenantId, String numeroFacture, Double montant) {
        Facture f = new Facture();
        f.setId(idGenerator.incrementAndGet());
        f.genererFactureElectronique(numeroFacture, montant);

        tenantFactures.computeIfAbsent(tenantId.toLowerCase(), k -> new ArrayList<>()).add(f);
        return f;
    }

    public List<Facture> getFactures(String tenantId) {
        List<Facture> factures = tenantFactures.get(tenantId.toLowerCase());
        if (factures == null || factures.isEmpty()) {
            Facture f1 = genererFacture(tenantId, "FAC-2026-001", 245000.0);
            Facture f2 = genererFacture(tenantId, "FAC-2026-002", 120000.0);
            return Arrays.asList(f1, f2);
        }
        return factures;
    }

    public boolean payerFacture(String tenantId, Long factureId, String modePaiement, Double montantRecu) {
        List<Facture> list = getFactures(tenantId);
        for (Facture f : list) {
            if (f.getId().equals(factureId)) {
                return f.traiterPaiementEnLigne(modePaiement, montantRecu);
            }
        }
        return false;
    }
}
