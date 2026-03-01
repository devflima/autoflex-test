package dev.flima.backend.integration;

import dev.flima.backend.domain.repository.ProductRepository;
import dev.flima.backend.domain.repository.RawMaterialRepository;
import dev.flima.backend.interfaces.dto.request.product.ProductRequestDTO;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ProductControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RawMaterialRepository rawMaterialRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldCreateAndReturnProduct() throws Exception {

        ProductRequestDTO dto = new ProductRequestDTO();
        dto.setCode("P1");
        dto.setName("Product Test");
        dto.setPrice(new BigDecimal("100"));

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Product Test"));
    }
}
