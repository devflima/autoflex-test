package dev.flima.backend.infrastructure.persistence.mapper.product;

import dev.flima.backend.domain.model.Product;
import dev.flima.backend.interfaces.dto.response.product.ProductResponseDTO;

public final class ProductDTOMapper {

    public ProductDTOMapper() {}

    public static ProductResponseDTO toResponseDTO(Product product) {
        return new ProductResponseDTO(
                product.getId(),
                product.getCode(),
                product.getName(),
                product.getPrice()
        );
    }

}
