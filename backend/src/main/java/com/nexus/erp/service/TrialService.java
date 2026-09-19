package com.nexus.erp.service;

import com.nexus.erp.model.central.Entreprise;
import com.nexus.erp.model.central.SuperAdministrateur;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TrialService {

    public static final int MAX_TRIAL_VISITS = 30;

    private final Map<String, Integer> trialVisitsStore = new ConcurrentHashMap<>();

    public int recordVisit(String tenantIdOrEmail) {
        String key = tenantIdOrEmail.toLowerCase();
        int currentVisits = trialVisitsStore.getOrDefault(key, 0);

        if (currentVisits >= MAX_TRIAL_VISITS) {
            throw new IllegalStateException("Période d'essai expirée (30 connexions effectuées). Veuillez souscrire un abonnement pour réactiver l'accès.");
        }

        int newCount = currentVisits + 1;
        trialVisitsStore.put(key, newCount);
        return newCount;
    }

    public int getRemainingVisits(String tenantIdOrEmail) {
        String key = tenantIdOrEmail.toLowerCase();
        int currentVisits = trialVisitsStore.getOrDefault(key, 0);
        return Math.max(0, MAX_TRIAL_VISITS - currentVisits);
    }

    public boolean isTrialExpired(String tenantIdOrEmail) {
        return getRemainingVisits(tenantIdOrEmail) <= 0;
    }

    public void resetTrialForSubscription(String tenantIdOrEmail) {
        trialVisitsStore.remove(tenantIdOrEmail.toLowerCase());
    }
}
