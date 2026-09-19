package com.nexus.erp.controller;

import com.nexus.erp.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/erp/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/list")
    public ResponseEntity<?> getNotifications(@RequestHeader(value = "X-Tenant-ID", defaultValue = "default") String tenantId) {
        return ResponseEntity.ok(notificationService.getNotifications(tenantId));
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendNotification(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "default") String tenantId,
            @RequestBody Map<String, String> body) {
        String titre = body.getOrDefault("titre", "Notification Nexus");
        String message = body.getOrDefault("message", "Contenu de la alerte");
        String type = body.getOrDefault("type", "SYSTEME");
        String canal = body.getOrDefault("canal", "IN_APP");
        String urgence = body.getOrDefault("urgence", "INFO");

        NotificationService.NotificationItem item = notificationService.mecreerNotification(tenantId, titre, message, type, canal, urgence);
        return ResponseEntity.ok(item);
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @RequestHeader(value = "X-Tenant-ID", defaultValue = "default") String tenantId,
            @PathVariable Long id) {
        notificationService.marquerCommeLu(tenantId, id);
        return ResponseEntity.ok(Map.of("message", "Notification marquée comme lue."));
    }
}
