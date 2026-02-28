package dev.flima.backend.application.useCase;

import dev.flima.backend.domain.model.RawMaterial;
import dev.flima.backend.domain.repository.RawMaterialRepository;
import dev.flima.backend.exceptions.RawMaterialNotFound;
import dev.flima.backend.infrastructure.persistence.entity.RawMaterialEntity;
import dev.flima.backend.infrastructure.persistence.mapper.rawMaterial.RawMaterialDTOMapper;
import dev.flima.backend.infrastructure.persistence.mapper.rawMaterial.RawMaterialMapper;
import dev.flima.backend.interfaces.dto.request.rawMaterials.RawMaterialRequestDTO;
import dev.flima.backend.interfaces.dto.response.rawMaterial.RawMaterialResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RawMaterialUseCase {

    @Autowired
    private RawMaterialRepository repository;

    public List<RawMaterialResponseDTO> findAll() {
        List<RawMaterialEntity> entities = repository.findAll();

        return entities.stream()
                .map(RawMaterialMapper::toDomain)
                .map(RawMaterialDTOMapper::toResponseDTO)
                .toList();
    }

    public RawMaterialResponseDTO findById(Long id) {
        RawMaterialEntity rawMaterial = repository.findById(id)
                .orElseThrow(() -> new RawMaterialNotFound("Raw material not found"));

        RawMaterial rm = RawMaterialMapper.toDomain(rawMaterial);

        return new RawMaterialResponseDTO(rm.getId(), rm.getCode(), rm.getName(), rm.getStockQuantity());
    }

    public RawMaterialResponseDTO create(RawMaterialRequestDTO dto) {
        RawMaterial rawMaterial = new RawMaterial();
        rawMaterial.setCode(dto.getCode());
        rawMaterial.setName(dto.getName());
        rawMaterial.setStockQuantity(dto.getStockQuantity());

        RawMaterialEntity rm = RawMaterialMapper.fromDomain(rawMaterial);

        repository.save(rm);

        return new RawMaterialResponseDTO(
                rm.getId(),
                rm.getCode(),
                rm.getName(),
                rm.getStockQuantity()
        );
    }

    public RawMaterialResponseDTO update(Long id, RawMaterialRequestDTO dto) {
        RawMaterialEntity rawMaterial = repository.findById(id)
                .orElseThrow(() -> new RawMaterialNotFound("Raw material not found"));

        rawMaterial.setCode(dto.getCode());
        rawMaterial.setName(dto.getName());
        rawMaterial.setStockQuantity(dto.getStockQuantity());

        RawMaterialEntity saved = repository.save(rawMaterial);

        return new RawMaterialResponseDTO(
                saved.getId(),
                saved.getCode(),
                saved.getName(),
                saved.getStockQuantity()
        );
    }

    public void deleteById(Long id) {
        repository.findById(id)
                .orElseThrow(() -> new RawMaterialNotFound("Raw material not found"));

        repository.deleteById(id);
    }

}
