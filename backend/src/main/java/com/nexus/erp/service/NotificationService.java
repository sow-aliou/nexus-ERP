package com.nexus.erp.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class NotificationService {

    public static class NotificationItem {
        private Long id;
        private String titre;
        private String message;
        private String type; // "STOCK", "FACTURATION", "SECURITE", "SYSTEME"
        private String canal; // "EMAIL", "SMS", "WEBHOOK", "IN_APP"
        private String urgence; // "INFO", "WARNING", "CRITICAL"
        private LocalDateTime dateCreation;
        private boolean lu;

        public NotificationItem() {}

        public NotificationItem(Long id, String titre, String message, String type, String canal, String urgence, LocalDateTime dateCreation, boolean lu) {
            this.id = id;
            this.titre = titre;
            this.message = message;
            this.type = type;
            this.canal = canal;
            this.urgence = urgence;
            this.dateCreation = dateCreation;
            this.lu = lu;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitre() { return titre; }
        public void setTitre(String titre) { this.titre = titre; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getCanal() { return canal; }
        public void setCanal(String canal) { this.canal = canal; }
        public String getUrgence() { return urgence; }
        public void setUrgence(String urgence) { this.urgence = urgence; }
        public LocalDateTime getDateCreation() { return dateCreation; }
        public void setDateCreation(LocalDateTime dateCreation) { this.dateCreation = dateCreation; }
        public boolean isLu() { return lu; }
        public void setLu(boolean lu) { this.lu = lu; }
    }

    private final Map<String, List<NotificationItem>> tenantNotifications = new ConcurrentHashMap<>();
    private final AtomicLong idGen = new AtomicLong(500);

    public List<NotificationItem> getNotifications(String tenantId) {
        List<NotificationItem> list = tenantNotifications.get(tenantId.toLowerCase());
        if (list == null || list.isEmpty()) {
            List<NotificationItem> defaults = new ArrayList<>();
            defaults.add(new NotificationItem(idGen.incrementAndGet(), "Alerte Seuil de Stock", "Le stock de 'Commutateur Cisco Catalyst 9300' est inférieur au seuil minimal (3 restant).", "STOCK", "EMAIL & IN_APP", "WARNING", LocalDateTime.now().minusMinutes(45), false));
            defaults.add(new NotificationItem(idGen.incrementAndGet(), "Facture Réglée", "La facture FAC-2026-0089 d'un montant de 245,000 DZD a été réglée en ligne par Sonatrach SPA.", "FACTURATION", "SMS & IN_APP", "INFO", LocalDateTime.now().minusHours(2), false));
            defaults.add(new NotificationItem(idGen.incrementAndGet(), "Rappel Période d'Essai", "Il vous reste 22 visites d'essai sur votre espace de démonstration Nexus ERP.", "SYSTEME", "IN_APP", "INFO", LocalDateTime.now().minusHours(5), true));
            tenantNotifications.put(tenantId.toLowerCase(), defaults);
            return defaults;
        }
        return list;
    }

    public NotificationItem mecreerNotification(String tenantId, String titre, String message, String type, String canal, String urgence) {
        NotificationItem item = new NotificationItem(
                idGen.incrementAndGet(),
                titre,
                message,
                type,
                canal,
                urgence,
                LocalDateTime.now(),
                false
        );
        tenantNotifications.computeIfAbsent(tenantId.toLowerCase(), k -> new ArrayList<>()).add(0, item);
        return item;
    }

    public void marquerCommeLu(String tenantId, Long notificationId) {
        List<NotificationItem> list = getNotifications(tenantId);
        for (NotificationItem n : list) {
            if (n.getId().equals(notificationId)) {
                n.setLu(true);
                break;
            }
        }
    }
}
