package dev.flima.backend.interfaces.dto.response.product;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ProductResponseDTO {

    private Long id;
    private String code;
    private String name;
    private BigDecimal price;

}
