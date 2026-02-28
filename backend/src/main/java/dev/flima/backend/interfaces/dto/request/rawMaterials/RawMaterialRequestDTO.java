package dev.flima.backend.interfaces.dto.request.rawMaterials;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class RawMaterialRequestDTO {
    private String code;
    private String name;
    private BigDecimal stockQuantity;
}
