package com.example.demo.controller;

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
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/reniec")


@CrossOrigin(origins = {
    "http://34.28.54.252",
    "http://34.28.54.252:80",
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173"
})
public class ReniecController {

    // URLs fijas de DECOLECTA
    private static final String RENIEC_API_URL = "https://api.decolecta.com/v1/reniec/dni";
    private static final String SUNAT_API_URL = "https://api.decolecta.com/v1/sunat/ruc";

    // Token configurado desde application.properties
    @Value("${decolecta.api.key:}")
    private String decolectaApiKey;

    /**
     * Obtiene la API KEY desde:
     * 1. application.properties
     * 2. variable de entorno en la máquina virtual
     */
    private String obtenerApiKey() {
        String envKey = System.getenv("DECOLECTA_API_KEY");
        if (decolectaApiKey != null && !decolectaApiKey.isBlank()) return decolectaApiKey;
        if (envKey != null && !envKey.isBlank()) return envKey;
        return null; 
    }

    // ==============================
    // CONSULTA DNI
    // ==============================
    @GetMapping("/dni/{numero}")
    public ResponseEntity<?> consultarDNI(@PathVariable String numero) {

        if (numero.length() != 8) {
            return ResponseEntity.badRequest().body(Map.of("error", "DNI inválido"));
        }

        String apiKey = obtenerApiKey();
        if (apiKey == null) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Falta API KEY",
                "mensaje", "Configura DECOLECTA_API_KEY en entorno o properties"
            ));
        }

        try {
            RestTemplate rest = new RestTemplate();

            HttpHeaders h = new HttpHeaders();
            h.set("Authorization", "Bearer " + apiKey);  // Token de acceso
            h.set("Content-Type", "application/json");

            String url = RENIEC_API_URL + "?numero=" + numero;

            ResponseEntity<Map<String, Object>> response = rest.exchange(
                url,
                HttpMethod.GET,
                new HttpEntity<>(h),
                new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> data = response.getBody();

            // Validación si no existe DNI
            if (data == null || data.get("document_number") == null) {
                return ResponseEntity.status(404).body(Map.of("error", "No se encontró información para el DNI"));
            }

            return ResponseEntity.ok(Map.of(
                "dni", data.get("document_number"),
                "nombres", data.get("first_name"),
                "apellidoPaterno", data.get("first_last_name"),
                "apellidoMaterno", data.get("second_last_name"),
                "nombreCompleto", data.get("full_name")
            ));

        } catch (HttpClientErrorException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(Map.of(
                "error", "Error del proveedor externo",
                "mensaje", ex.getResponseBodyAsString()
            ));

        } catch (HttpServerErrorException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(Map.of(
                "error", "Error en el servidor externo",
                "mensaje", ex.getResponseBodyAsString()
            ));

        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "No se pudo consultar DNI",
                "mensaje", ex.getMessage()
            ));
        }
    }

    // ==============================
    // CONSULTA RUC
    // ==============================
    @GetMapping("/ruc/{numero}")
    public ResponseEntity<?> consultarRUC(@PathVariable String numero) {

        if (numero.length() != 11) {
            return ResponseEntity.badRequest().body(Map.of("error", "RUC inválido"));
        }

        String apiKey = obtenerApiKey();
        if (apiKey == null) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Falta API KEY",
                "mensaje", "Configura DECOLECTA_API_KEY en entorno o properties"
            ));
        }

        try {
            RestTemplate rest = new RestTemplate();

            HttpHeaders h = new HttpHeaders();
            h.set("Authorization", "Bearer " + apiKey);
            h.set("Content-Type", "application/json");

            String url = SUNAT_API_URL + "?numero=" + numero;

            ResponseEntity<Map<String, Object>> response = rest.exchange(
                url,
                HttpMethod.GET,
                new HttpEntity<>(h),
                new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> data = response.getBody();

            if (data == null || data.get("numero_documento") == null) {
                return ResponseEntity.status(404).body(Map.of("error", "No se encontró información para el RUC"));
            }

            return ResponseEntity.ok(Map.of(
                "ruc", data.get("numero_documento"),
                "razonSocial", data.get("razon_social"),
                "direccion", data.get("direccion"),
                "estado", data.get("estado"),
                "condicion", data.get("condicion")
            ));

        } catch (HttpClientErrorException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(Map.of(
                "error", "Error del proveedor externo",
                "mensaje", ex.getResponseBodyAsString()
            ));

        } catch (HttpServerErrorException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(Map.of(
                "error", "Error del servidor externo",
                "mensaje", ex.getResponseBodyAsString()
            ));

        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "No se pudo consultar RUC",
                "mensaje", ex.getMessage()
            ));
        }
    }
}
