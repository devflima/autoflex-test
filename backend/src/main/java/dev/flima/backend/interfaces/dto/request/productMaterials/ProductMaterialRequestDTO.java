package dev.flima.backend.interfaces.dto.request.productMaterials;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductMaterialRequestDTO {

    private Long product;
    private Long rawMaterial;
    private BigDecimal requiredQuantity;

}
