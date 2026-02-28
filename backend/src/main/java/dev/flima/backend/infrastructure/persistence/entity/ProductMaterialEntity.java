package dev.flima.backend.infrastructure.persistence.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@Table(
        name = "product_raw_materials",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"product_id", "raw_material_id"}
                )
        }
)
public class ProductMaterialEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private ProductEntity productEntity;

    @ManyToOne
    @JoinColumn(name = "raw_material_id")
    private RawMaterialEntity rawMaterialEntity;

    @NotNull
    @Column(name = "required_quantity")
    private BigDecimal requiredQuantity;

}
