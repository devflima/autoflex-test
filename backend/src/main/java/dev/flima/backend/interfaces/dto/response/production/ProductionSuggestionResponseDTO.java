package dev.flima.backend.interfaces.dto.response.production;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ProductionSuggestionResponseDTO {
    private Long productId;
    private String productName;
    private BigDecimal quantity;
    private BigDecimal totalValue;
}
