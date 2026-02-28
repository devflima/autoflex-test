package dev.flima.backend.interfaces.dto.request.product;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequestDTO {

    private String code;
    private String name;
    private BigDecimal price;

}