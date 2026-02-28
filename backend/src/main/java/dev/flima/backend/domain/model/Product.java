package dev.flima.backend.domain.model;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class Product {

    private Long id;
    private String code;
    private String name;
    private BigDecimal price;
    private List<ProductMaterial> materials;

}
