package com.nexus.erp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String index() {
        return "Nexus ERP Backend API";
    }

    @GetMapping("/api/health")
    public String health() {
        return "OK";
    }
}
