package dev.flima.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "products")
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false, unique = true)
    private String code;

    @NotNull
    @Column(nullable = false)
    private String name;

    @NotNull
    private BigDecimal price;

    @OneToMany(mappedBy = "productEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    public List<ProductMaterialEntity> materials = new ArrayList<>();

    public void addMaterial(ProductMaterialEntity productMaterial) {
        if (materials == null) {
            materials = new ArrayList<>();
        }
        materials.add(productMaterial);
        productMaterial.setProductEntity(this);
    }

}
