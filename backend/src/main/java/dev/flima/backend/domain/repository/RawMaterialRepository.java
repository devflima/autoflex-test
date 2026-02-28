package dev.flima.backend.domain.repository;

import dev.flima.backend.infrastructure.persistence.entity.RawMaterialEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RawMaterialRepository extends JpaRepository<RawMaterialEntity, Long> {
}
