package com.nexus.erp.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AnalyticsService {

    public static class AnalyticsSummary {
        private double chiffreAffairesMois;
        private double chiffreAffairesAnnee;
        private double tresorerieActuelle;
        private double valeurStockTotal;
        private double margeBrutePourcentage;
        private int totalClientsActifs;
        private List<Map<String, Object>> ventesParMois = new ArrayList<>();
        private List<Map<String, Object>> repartitionProduits = new ArrayList<>();

        public AnalyticsSummary() {}

        public double getChiffreAffairesMois() { return chiffreAffairesMois; }
        public void setChiffreAffairesMois(double chiffreAffairesMois) { this.chiffreAffairesMois = chiffreAffairesMois; }
        public double getChiffreAffairesAnnee() { return chiffreAffairesAnnee; }
        public void setChiffreAffairesAnnee(double chiffreAffairesAnnee) { this.chiffreAffairesAnnee = chiffreAffairesAnnee; }
        public double getTresorerieActuelle() { return tresorerieActuelle; }
        public void setTresorerieActuelle(double tresorerieActuelle) { this.tresorerieActuelle = tresorerieActuelle; }
        public double getValeurStockTotal() { return valeurStockTotal; }
        public void setValeurStockTotal(double valeurStockTotal) { this.valeurStockTotal = valeurStockTotal; }
        public double getMargeBrutePourcentage() { return margeBrutePourcentage; }
        public void setMargeBrutePourcentage(double margeBrutePourcentage) { this.margeBrutePourcentage = margeBrutePourcentage; }
        public int getTotalClientsActifs() { return totalClientsActifs; }
        public void setTotalClientsActifs(int totalClientsActifs) { this.totalClientsActifs = totalClientsActifs; }
        public List<Map<String, Object>> getVentesParMois() { return ventesParMois; }
        public void setVentesParMois(List<Map<String, Object>> ventesParMois) { this.ventesParMois = ventesParMois; }
        public List<Map<String, Object>> getRepartitionProduits() { return repartitionProduits; }
        public void setRepartitionProduits(List<Map<String, Object>> repartitionProduits) { this.repartitionProduits = repartitionProduits; }
    }

    public AnalyticsSummary getSummary(String tenantId) {
        AnalyticsSummary summary = new AnalyticsSummary();
        summary.setChiffreAffairesMois(184500.0);
        summary.setChiffreAffairesAnnee(2140000.0);
        summary.setTresorerieActuelle(485000.0);
        summary.setValeurStockTotal(312000.0);
        summary.setMargeBrutePourcentage(34.5);
        summary.setTotalClientsActifs(42);

        List<Map<String, Object>> monthly = new ArrayList<>();
        monthly.add(Map.of("mois", "Jan", "montant", 145000));
        monthly.add(Map.of("mois", "Fév", "montant", 162000));
        monthly.add(Map.of("mois", "Mar", "montant", 178000));
        monthly.add(Map.of("mois", "Avr", "montant", 155000));
        monthly.add(Map.of("mois", "Mai", "montant", 192000));
        monthly.add(Map.of("mois", "Juin", "montant", 210000));
        summary.setVentesParMois(monthly);

        List<Map<String, Object>> repartition = new ArrayList<>();
        repartition.add(Map.of("categorie", "Équipements IT", "pourcentage", 45));
        repartition.add(Map.of("categorie", "Licences Logiciels", "pourcentage", 30));
        repartition.add(Map.of("categorie", "Services & Maintenance", "pourcentage", 25));
        summary.setRepartitionProduits(repartition);

        return summary;
    }

    public Map<String, Object> getForecast(String tenantId) {
        return Map.of(
            "trimestreProchainCA", 680000.0,
            "croissanceEstimee", "+12.4%",
            "risqueRuptureStock", "FAIBLE",
            "recommandationIA", "Optimiser le niveau de stock sur les serveurs Dell PowerEdge R750 avant Q4."
        );
    }
}
