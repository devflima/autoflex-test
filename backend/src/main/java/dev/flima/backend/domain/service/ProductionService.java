package dev.flima.backend.domain.service;

import dev.flima.backend.domain.repository.ProductRepository;
import dev.flima.backend.domain.repository.RawMaterialRepository;
import dev.flima.backend.infrastructure.persistence.entity.ProductEntity;
import dev.flima.backend.infrastructure.persistence.entity.ProductMaterialEntity;
import dev.flima.backend.infrastructure.persistence.entity.RawMaterialEntity;
import dev.flima.backend.interfaces.dto.response.production.ProductionSuggestionResponseDTO;
import dev.flima.backend.interfaces.dto.response.production.ProductionSummaryResponseDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductionService {

    public ProductionSummaryResponseDTO suggestProduction(ProductRepository productRepository, RawMaterialRepository materialRepository) {
        List<ProductEntity> products = new ArrayList<>(productRepository.findAll());

        products.sort(Comparator.comparing(ProductEntity::getPrice).reversed());

        Map<Long, BigDecimal> virtualStock = materialRepository.findAll()
                .stream()
                .collect(Collectors.toMap(
                        RawMaterialEntity::getId,
                        RawMaterialEntity::getStockQuantity
                ));

        List<ProductionSuggestionResponseDTO> suggestions = new ArrayList<>();
        BigDecimal totalProductionValue = BigDecimal.ZERO;

        for(ProductEntity product : products) {
            BigDecimal maxProduction = calculateMaxProduction(product, virtualStock);

            if(maxProduction.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal totalValue = maxProduction.multiply(product.getPrice());

                totalProductionValue = totalProductionValue.add(totalValue);

                suggestions.add(new ProductionSuggestionResponseDTO(
                        product.getId(),
                        product.getName(),
                        maxProduction,
                        totalValue
                ));

                consumeStock(product, maxProduction, virtualStock);
            }
        }
        return new ProductionSummaryResponseDTO(suggestions, totalProductionValue);
    }

    private BigDecimal calculateMaxProduction(ProductEntity product, Map<Long, BigDecimal> virtualStock) {
        BigDecimal maxProduction = null;

        for(ProductMaterialEntity material : product.getMaterials()) {
            BigDecimal available = virtualStock.get(material.getRawMaterialEntity().getId());

            BigDecimal required = material.getRequiredQuantity();

            if (required.compareTo(BigDecimal.ZERO) == 0) {
                return BigDecimal.ZERO;
            }

            BigDecimal possible = available.divide(required, 0, RoundingMode.DOWN);

            if(maxProduction == null || possible.compareTo(maxProduction) < 0) {
                maxProduction = possible;
            }
        }
        return maxProduction == null ? BigDecimal.ZERO : maxProduction;
    }

    private void consumeStock(ProductEntity product, BigDecimal quantityProduced, Map<Long, BigDecimal> virtualStock) {
        for(ProductMaterialEntity material : product.getMaterials()) {
            Long rawMaterialId = material.getRawMaterialEntity().getId();

            BigDecimal requiredTotal = material.getRequiredQuantity().multiply(quantityProduced);

            BigDecimal remaining = virtualStock.get(rawMaterialId).subtract(requiredTotal);

            virtualStock.put(rawMaterialId, remaining);
        }
    }

}
