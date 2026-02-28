package dev.flima.backend.interfaces.dto.response.rawMaterial;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class RawMaterialResponseDTO {
    private Long id;
    private String code;
    private String name;
    private BigDecimal stockQuantity;
}
