package dev.flima.backend.infrastructure.persistence.mapper.productMaterial;

import dev.flima.backend.domain.model.ProductMaterial;
import dev.flima.backend.infrastructure.persistence.entity.ProductMaterialEntity;
import dev.flima.backend.infrastructure.persistence.mapper.rawMaterial.RawMaterialMapper;
import dev.flima.backend.infrastructure.persistence.mapper.product.ProductMapper;

public final class ProductMaterialMapper {

    private ProductMaterialMapper() {}

    public static ProductMaterialEntity fromDomain(ProductMaterial domain) {
        ProductMaterialEntity entity = new ProductMaterialEntity();
        entity.setId(domain.getId());
        entity.setProductEntity(ProductMapper.fromDomain(domain.getProduct()));
        entity.setRawMaterialEntity(RawMaterialMapper.fromDomain(domain.getRawMaterial()));
        entity.setRequiredQuantity(domain.getRequiredQuantity());

        return entity;
    }

    public static ProductMaterial toDomain(ProductMaterialEntity entity) {
        ProductMaterial domain = new ProductMaterial();
        domain.setId(entity.getId());
        domain.setProduct(ProductMapper.toDomain(entity.getProductEntity()));
        domain.setRawMaterial(RawMaterialMapper.toDomain(entity.getRawMaterialEntity()));
        domain.setRequiredQuantity(entity.getRequiredQuantity());

        return domain;
    }

}
