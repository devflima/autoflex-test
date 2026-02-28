package dev.flima.backend.domain.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RawMaterial {

    private Long id;
    private String code;
    private String name;
    private BigDecimal stockQuantity;

}
