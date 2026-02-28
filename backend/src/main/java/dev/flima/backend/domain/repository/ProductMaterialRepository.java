package dev.flima.backend.domain.repository;

import dev.flima.backend.infrastructure.persistence.entity.ProductEntity;
import dev.flima.backend.infrastructure.persistence.entity.ProductMaterialEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductMaterialRepository extends JpaRepository<ProductMaterialEntity, Long> {
    @Query("""
        SELECT DISTINCT p FROM ProductEntity p
        LEFT JOIN FETCH p.materials pm
        LEFT JOIN FETCH pm.rawMaterialEntity
        WHERE p.id = :id
    """)
    Optional<ProductEntity> findByIdWithMaterials(@Param("id") Long id);

    boolean existsByProductEntityIdAndRawMaterialEntityId(
            Long productId,
            Long rawMaterialId
    );
}
