package com.nexus.erp.controller;

import com.nexus.erp.service.OcrService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/erp/ocr")
@CrossOrigin(origins = "*")
public class OcrController {

    private final OcrService ocrService;

    public OcrController(OcrService ocrService) {
        this.ocrService = ocrService;
    }

    @PostMapping("/parse-invoice")
    public ResponseEntity<?> parseInvoice(@RequestParam(value = "file", required = false) MultipartFile file) {
        String filename = (file != null && !file.isEmpty()) ? file.getOriginalFilename() : "facture_fournisseur_scanne.pdf";
        byte[] content = null;
        try {
            if (file != null && !file.isEmpty()) {
                content = file.getBytes();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Impossible de lire le fichier: " + e.getMessage()));
        }

        OcrService.OcrResult result = ocrService.extractInvoiceData(filename, content);
        return ResponseEntity.ok(result);
    }
}
