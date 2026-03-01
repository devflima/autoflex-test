package dev.flima.backend.unit.service;

import dev.flima.backend.domain.repository.ProductRepository;
import dev.flima.backend.domain.repository.RawMaterialRepository;
import dev.flima.backend.domain.service.ProductionService;
import dev.flima.backend.infrastructure.persistence.entity.ProductEntity;
import dev.flima.backend.infrastructure.persistence.entity.ProductMaterialEntity;
import dev.flima.backend.infrastructure.persistence.entity.RawMaterialEntity;
import dev.flima.backend.interfaces.dto.response.production.ProductionSuggestionResponseDTO;
import dev.flima.backend.interfaces.dto.response.production.ProductionSummaryResponseDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductionServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private RawMaterialRepository rawMaterialRepository;

    @InjectMocks
    private ProductionService productionService;

    @Test
    void shouldPrioritizeHigherPriceProductAndConsumeStock() {

        // Arrange
        RawMaterialEntity flour = new RawMaterialEntity();
        flour.setId(1L);
        flour.setStockQuantity(new BigDecimal("10"));

        ProductEntity expensive = new ProductEntity();
        expensive.setId(1L);
        expensive.setName("Expensive");
        expensive.setPrice(new BigDecimal("100"));

        ProductMaterialEntity expMaterial = new ProductMaterialEntity();
        expMaterial.setProductEntity(expensive);
        expMaterial.setRawMaterialEntity(flour);
        expMaterial.setRequiredQuantity(new BigDecimal("5"));

        expensive.setMaterials(List.of(expMaterial));

        ProductEntity cheap = new ProductEntity();
        cheap.setId(2L);
        cheap.setName("Cheap");
        cheap.setPrice(new BigDecimal("50"));

        ProductMaterialEntity cheapMaterial = new ProductMaterialEntity();
        cheapMaterial.setProductEntity(cheap);
        cheapMaterial.setRawMaterialEntity(flour);
        cheapMaterial.setRequiredQuantity(new BigDecimal("2"));

        cheap.setMaterials(List.of(cheapMaterial));

        when(productRepository.findAll())
                .thenReturn(List.of(cheap, expensive));

        when(rawMaterialRepository.findAll())
                .thenReturn(List.of(flour));

        // Act
        ProductionSummaryResponseDTO result =
                productionService.suggestProduction(productRepository, rawMaterialRepository);

        // Assert
        assertEquals(1, result.getSuggestions().size());

        ProductionSuggestionResponseDTO suggestion =
                result.getSuggestions().getFirst();

        assertEquals("Expensive", suggestion.getProductName());
        assertEquals(new BigDecimal("2"), suggestion.getQuantity());
        assertEquals(new BigDecimal("200"), suggestion.getTotalValue());
    }

    @Test
    void shouldReturnEmptyWhenStockIsInsufficient() {

        RawMaterialEntity flour = new RawMaterialEntity();
        flour.setId(1L);
        flour.setStockQuantity(new BigDecimal("1"));

        ProductEntity product = new ProductEntity();
        product.setId(1L);
        product.setName("Test");
        product.setPrice(new BigDecimal("100"));

        ProductMaterialEntity material = new ProductMaterialEntity();
        material.setProductEntity(product);
        material.setRawMaterialEntity(flour);
        material.setRequiredQuantity(new BigDecimal("5"));

        product.setMaterials(List.of(material));

        when(productRepository.findAll()).thenReturn(List.of(product));
        when(rawMaterialRepository.findAll()).thenReturn(List.of(flour));

        ProductionSummaryResponseDTO result =
                productionService.suggestProduction(productRepository, rawMaterialRepository);

        assertTrue(result.getSuggestions().isEmpty());
        assertEquals(BigDecimal.ZERO, result.getTotalProductionValue());
    }

}