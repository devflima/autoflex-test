package dev.flima.backend.unit.useCase;

import dev.flima.backend.application.useCase.ProductUseCase;
import dev.flima.backend.domain.repository.ProductRepository;
import dev.flima.backend.domain.repository.RawMaterialRepository;
import dev.flima.backend.domain.service.ProductionService;
import dev.flima.backend.exceptions.ProductNotFound;
import dev.flima.backend.infrastructure.persistence.entity.ProductEntity;
import dev.flima.backend.interfaces.dto.response.product.ProductResponseDTO;
import dev.flima.backend.interfaces.dto.response.production.ProductionSummaryResponseDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductUseCaseTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private RawMaterialRepository rawMaterialRepository;

    @Mock
    private ProductionService productionService;

    @InjectMocks
    private ProductUseCase productUseCase;

    @Test
    void shouldReturnProductWhenIdExists() {

        ProductEntity entity = new ProductEntity();
        entity.setId(1L);
        entity.setCode("P1");
        entity.setName("Product");
        entity.setPrice(new BigDecimal("100"));

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(entity));

        ProductResponseDTO result =
                productUseCase.findById(1L);

        assertEquals("P1", result.getCode());
        assertEquals("Product", result.getName());
    }

    @Test
    void shouldThrowWhenProductNotFound() {

        when(productRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(ProductNotFound.class,
                () -> productUseCase.findById(1L));
    }

    @Test
    void shouldDelegateToProductionService() {

        ProductionSummaryResponseDTO mockResponse =
                new ProductionSummaryResponseDTO(
                        List.of(),
                        BigDecimal.ZERO
                );

        when(productionService.suggestProduction(productRepository, rawMaterialRepository))
                .thenReturn(mockResponse);

        ProductionSummaryResponseDTO result =
                productUseCase.suggestion();

        assertEquals(mockResponse, result);
        verify(productionService).suggestProduction(productRepository, rawMaterialRepository);
    }
}
