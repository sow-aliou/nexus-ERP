package com.nexus.erp.controller;

import com.nexus.erp.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/erp/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@RequestHeader(value = "X-Tenant-ID", defaultValue = "default") String tenantId) {
        return ResponseEntity.ok(analyticsService.getSummary(tenantId));
    }

    @GetMapping("/forecast")
    public ResponseEntity<?> getForecast(@RequestHeader(value = "X-Tenant-ID", defaultValue = "default") String tenantId) {
        return ResponseEntity.ok(analyticsService.getForecast(tenantId));
    }
}
