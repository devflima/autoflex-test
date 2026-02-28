package dev.flima.backend.domain.model;

import lombok.*;

import java.math.BigDecimal;

@Data
public class ProductMaterial {

    private Long id;
    private Product product;
    private RawMaterial rawMaterial;
    private BigDecimal requiredQuantity;

}
