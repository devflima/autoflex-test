package dev.flima.backend.interfaces.dto.response.productMaterial;

import dev.flima.backend.domain.model.Product;
import dev.flima.backend.domain.model.RawMaterial;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ProductMaterialResponseDTO {

    private Long id;
    private Long rawMaterialId;
    private String rawMaterialName;
    private BigDecimal requiredQuantity;

}
