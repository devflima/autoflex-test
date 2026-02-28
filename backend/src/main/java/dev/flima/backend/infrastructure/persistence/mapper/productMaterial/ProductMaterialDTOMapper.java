package dev.flima.backend.infrastructure.persistence.mapper.productMaterial;

import dev.flima.backend.domain.model.ProductMaterial;
import dev.flima.backend.interfaces.dto.response.productMaterial.ProductMaterialResponseDTO;

public final class ProductMaterialDTOMapper {

    private ProductMaterialDTOMapper() {}

    public static ProductMaterialResponseDTO toResponse(ProductMaterial rawMaterial) {
        return new ProductMaterialResponseDTO(
                rawMaterial.getId(),
                rawMaterial.getRawMaterial().getId(),
                rawMaterial.getRawMaterial().getName(),
                rawMaterial.getRequiredQuantity()
        );
    }

}
