package dev.flima.backend.infrastructure.persistence.mapper.product;

import dev.flima.backend.domain.model.Product;
import dev.flima.backend.infrastructure.persistence.entity.ProductEntity;

import java.util.List;

public final class ProductMapper {

    private ProductMapper() {}

    public static ProductEntity fromDomain(Product domain) {
        ProductEntity entity = new ProductEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        entity.setCode(domain.getCode());
        entity.setPrice(domain.getPrice());

        return entity;
    }

    public static Product toDomain(ProductEntity entity) {
        Product domain = new Product();
        domain.setId(entity.getId());
        domain.setName(entity.getName());
        domain.setCode(entity.getCode());
        domain.setPrice(entity.getPrice());

        return domain;
    }
}
