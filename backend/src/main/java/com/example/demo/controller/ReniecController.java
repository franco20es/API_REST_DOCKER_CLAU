package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/reniec")
@CrossOrigin(origins = {"http://localhost", "http://localhost:3000", "http://localhost:5173", "http://34.28.54.252"})
public class ReniecController {

    private static final String RENIEC_API_URL = "https://api.decolecta.com/v1/reniec/dni";
    private static final String SUNAT_API_URL = "https://api.decolecta.com/v1/sunat/ruc";

    // Read API key from environment variable DECOLECTA_API_KEY or from application properties (decolecta.api.key)
    @Value("${decolecta.api.key:}")
    private String decolectaApiKey;

    /**
     * Consultar DNI en RENIEC
     */
    @GetMapping("/dni/{numero}")
    public ResponseEntity<?> consultarDNI(@PathVariable String numero) {
        // determine API key from property or environment variable
        String apiKey = (decolectaApiKey != null && !decolectaApiKey.isBlank()) ? decolectaApiKey : System.getenv("DECOLECTA_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Missing API key for DeColecta");
            error.put("mensaje", "Set DECOLECTA_API_KEY env var or decolecta.api.key property");
            return ResponseEntity.status(500).body(error);
        }

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);
        String url = RENIEC_API_URL + "?numero=" + numero;

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map<String, Object> data = response.getBody();

            // Validar respuesta
            if (data == null || data.get("document_number") == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "No se encontró información para el DNI");
                if (data != null && data.containsKey("error")) {
                    error.put("mensaje", String.valueOf(data.get("error")));
                }
                return ResponseEntity.status(404).body(error);
            }

            // Formatear respuesta
            Map<String, Object> result = new HashMap<>();
            result.put("dni", data.get("document_number"));
            result.put("nombres", data.get("first_name"));
            result.put("apellidoPaterno", data.get("first_last_name"));
            result.put("apellidoMaterno", data.get("second_last_name"));
            result.put("nombreCompleto", data.get("full_name"));
            return ResponseEntity.ok(result);

        } catch (HttpClientErrorException ex) {
            // Cuando la API externa devuelve 4xx (ej. 401 Apikey/Limit)
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error desde proveedor externo: " + ex.getStatusCode().toString());
            String body = ex.getResponseBodyAsString();
            error.put("mensaje", body != null ? body : ex.getMessage());
            return ResponseEntity.status(ex.getStatusCode().value()).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No se pudo consultar el DNI");
            error.put("mensaje", e.getMessage());
            if (e.getCause() != null) {
                error.put("detalle", e.getCause().getMessage());
            }
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Consultar RUC en SUNAT
     */
    @GetMapping("/ruc/{numero}")
    public ResponseEntity<?> consultarRUC(@PathVariable String numero) {
        // determine API key
        String apiKey = (decolectaApiKey != null && !decolectaApiKey.isBlank()) ? decolectaApiKey : System.getenv("DECOLECTA_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Missing API key for DeColecta");
            error.put("mensaje", "Set DECOLECTA_API_KEY env var or decolecta.api.key property");
            return ResponseEntity.status(500).body(error);
        }

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        String url = SUNAT_API_URL + "?numero=" + numero;
        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
            Map<String, Object> data = response.getBody();

            // Formatear respuesta
            Map<String, Object> result = new HashMap<>();
            result.put("ruc", data.get("numero_documento"));
            result.put("razonSocial", data.get("razon_social"));
            result.put("direccion", data.get("direccion"));
            result.put("estado", data.get("estado"));
            result.put("condicion", data.get("condicion"));

            return ResponseEntity.ok(result);
        } catch (HttpClientErrorException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error desde proveedor externo: " + ex.getStatusCode().toString());
            String body = ex.getResponseBodyAsString();
            error.put("mensaje", body != null ? body : ex.getMessage());
            return ResponseEntity.status(ex.getStatusCode().value()).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No se pudo consultar el RUC");
            error.put("mensaje", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
