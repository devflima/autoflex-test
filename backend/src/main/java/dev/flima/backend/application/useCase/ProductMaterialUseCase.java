package dev.flima.backend.application.useCase;

import dev.flima.backend.domain.model.ProductMaterial;
import dev.flima.backend.domain.repository.ProductMaterialRepository;
import dev.flima.backend.domain.repository.ProductRepository;
import dev.flima.backend.domain.repository.RawMaterialRepository;
import dev.flima.backend.exceptions.ProductNotFound;
import dev.flima.backend.exceptions.ProductMaterialException;
import dev.flima.backend.infrastructure.persistence.entity.ProductEntity;
import dev.flima.backend.infrastructure.persistence.entity.ProductMaterialEntity;
import dev.flima.backend.infrastructure.persistence.entity.RawMaterialEntity;
import dev.flima.backend.infrastructure.persistence.mapper.productMaterial.ProductMaterialDTOMapper;
import dev.flima.backend.infrastructure.persistence.mapper.productMaterial.ProductMaterialMapper;
import dev.flima.backend.interfaces.dto.request.productMaterials.ProductMaterialRequestDTO;
import dev.flima.backend.interfaces.dto.response.productMaterial.ProductMaterialResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductMaterialUseCase {

    @Autowired
    private ProductMaterialRepository repository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RawMaterialRepository rawMaterialRepository;

    public List<ProductMaterialResponseDTO> findAll() {
        List<ProductMaterialEntity> entities = repository.findAll();

        return entities.stream()
                .map(ProductMaterialMapper::toDomain)
                .map(ProductMaterialDTOMapper::toResponse)
                .toList();
    }

    public ProductMaterialResponseDTO findById(Long id) {
        ProductMaterialEntity entity = repository.findById(id)
                .orElseThrow(() -> new ProductMaterialException("Product raw material not found"));

        ProductMaterial domain = ProductMaterialMapper.toDomain(entity);

        return new ProductMaterialResponseDTO(
                domain.getId(),
                domain.getRawMaterial().getId(),
                domain.getRawMaterial().getName(),
                domain.getRequiredQuantity()
        );
    }

    public ProductMaterialResponseDTO create(ProductMaterialRequestDTO dto) {

        if (repository.existsByProductEntityIdAndRawMaterialEntityId(
                dto.getProduct(),
                dto.getRawMaterial())) {

            throw new RuntimeException("Raw material already associated with this product");
        }

        ProductEntity product = productRepository.findById(dto.getProduct())
                .orElseThrow(() -> new ProductNotFound("Product not found"));

        RawMaterialEntity rawMaterial = rawMaterialRepository.findById(dto.getRawMaterial())
                .orElseThrow(() -> new ProductMaterialException("Raw material not found"));

        ProductMaterialEntity entity = new ProductMaterialEntity();
        product.addMaterial(entity);
        entity.setRawMaterialEntity(rawMaterial);
        entity.setRequiredQuantity(dto.getRequiredQuantity());

        repository.save(entity);

        ProductMaterial domain = ProductMaterialMapper.toDomain(entity);

        return new ProductMaterialResponseDTO(
                domain.getId(),
                domain.getRawMaterial().getId(),
                domain.getRawMaterial().getName(),
                domain.getRequiredQuantity()
        );
    }

    public ProductMaterialResponseDTO update(Long id, ProductMaterialRequestDTO dto) {
        ProductMaterialEntity entity = repository.findById(id)
                .orElseThrow(() -> new ProductMaterialException("Product raw material not found"));

        ProductEntity product = productRepository.findById(dto.getProduct())
                .orElseThrow(() -> new ProductNotFound("Product not found"));

        RawMaterialEntity rawMaterial = rawMaterialRepository.findById(dto.getRawMaterial())
                .orElseThrow(() -> new ProductMaterialException("Raw material not found"));

        entity.setProductEntity(product);
        entity.setRawMaterialEntity(rawMaterial);
        entity.setRequiredQuantity(dto.getRequiredQuantity());

        ProductMaterialEntity saved = repository.save(entity);

        return new ProductMaterialResponseDTO(
                saved.getId(),
                saved.getRawMaterialEntity().getId(),
                saved.getRawMaterialEntity().getName(),
                saved.getRequiredQuantity()
        );
    }

    public void delete(Long id) {
        repository.findById(id)
                .orElseThrow(() -> new ProductMaterialException("Product raw material not found"));

        repository.deleteById(id);
    }

}
