package dev.flima.backend.infrastructure.persistence.mapper.rawMaterial;

import dev.flima.backend.domain.model.RawMaterial;
import dev.flima.backend.interfaces.dto.response.rawMaterial.RawMaterialResponseDTO;

public final class RawMaterialDTOMapper {

    public RawMaterialDTOMapper() {}

    public static RawMaterialResponseDTO toResponseDTO(RawMaterial rawMaterials) {
        return new RawMaterialResponseDTO(
                rawMaterials.getId(),
                rawMaterials.getCode(),
                rawMaterials.getName(),
                rawMaterials.getStockQuantity()
        );
    }

}
