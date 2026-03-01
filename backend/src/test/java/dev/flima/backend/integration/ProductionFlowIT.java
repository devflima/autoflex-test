package dev.flima.backend.integration;

import dev.flima.backend.domain.repository.ProductRepository;
import dev.flima.backend.domain.repository.RawMaterialRepository;
import dev.flima.backend.infrastructure.persistence.entity.ProductEntity;
import dev.flima.backend.infrastructure.persistence.entity.ProductMaterialEntity;
import dev.flima.backend.infrastructure.persistence.entity.RawMaterialEntity;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;

import java.math.BigDecimal;
import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ProductionFlowIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RawMaterialRepository rawMaterialRepository;

    @Test
    void shouldGenerateProductionSuggestions() throws Exception {

        // ---------- RAW MATERIAL ----------
        RawMaterialEntity flour = new RawMaterialEntity();
        flour.setCode("RM1");
        flour.setName("Flour");
        flour.setStockQuantity(new BigDecimal("10"));
        rawMaterialRepository.save(flour);

        // ---------- PRODUCT ----------
        ProductEntity product = new ProductEntity();
        product.setCode("P1");
        product.setName("Cake");
        product.setPrice(new BigDecimal("100"));

        ProductMaterialEntity pm = new ProductMaterialEntity();
        pm.setProductEntity(product);
        pm.setRawMaterialEntity(flour);
        pm.setRequiredQuantity(new BigDecimal("5"));

        product.setMaterials(List.of(pm));

        productRepository.save(product);

        // ---------- CALL ENDPOINT ----------
        mockMvc.perform(get("/products/suggestions"))
                .andExpect(status().isOk())
                .andExpect((ResultMatcher) jsonPath("$.totalProductionValue").value(200))
                .andExpect((ResultMatcher) jsonPath("$.suggestions[0].productName").value("Cake"))
                .andExpect((ResultMatcher) jsonPath("$.suggestions[0].quantity").value(2));
    }

}
