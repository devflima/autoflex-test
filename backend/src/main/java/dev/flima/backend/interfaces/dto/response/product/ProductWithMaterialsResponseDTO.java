package dev.flima.backend.interfaces.dto.response.product;

import dev.flima.backend.interfaces.dto.response.productMaterial.ProductMaterialResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class ProductWithMaterialsResponseDTO {

    private Long id;
    private String code;
    private String name;
    private BigDecimal price;
    private List<ProductMaterialResponseDTO> materials;

}
