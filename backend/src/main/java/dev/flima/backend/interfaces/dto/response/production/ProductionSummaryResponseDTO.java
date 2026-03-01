package dev.flima.backend.interfaces.dto.response.production;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class ProductionSummaryResponseDTO {
    private List<ProductionSuggestionResponseDTO> suggestions;
    private BigDecimal totalProductionValue;
}
