package dev.flima.backend.infrastructure.persistence.mapper.rawMaterial;

import dev.flima.backend.domain.model.RawMaterial;
import dev.flima.backend.infrastructure.persistence.entity.RawMaterialEntity;

public final class RawMaterialMapper {

    public RawMaterialMapper() {}

    public static RawMaterialEntity fromDomain(RawMaterial domain) {
        RawMaterialEntity entity = new RawMaterialEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        entity.setCode(domain.getCode());
        entity.setStockQuantity(domain.getStockQuantity());

        return entity;
    }

    public static RawMaterial toDomain(RawMaterialEntity entity) {
        RawMaterial domain = new RawMaterial();
        domain.setId(entity.getId());
        domain.setName(entity.getName());
        domain.setCode(entity.getCode());
        domain.setStockQuantity(entity.getStockQuantity());

        return domain;
    }

}
