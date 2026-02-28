package dev.flima.backend.application.useCase;

import dev.flima.backend.domain.model.Product;
import dev.flima.backend.domain.model.ProductMaterial;
import dev.flima.backend.domain.repository.ProductMaterialRepository;
import dev.flima.backend.domain.repository.ProductRepository;
import dev.flima.backend.domain.repository.RawMaterialRepository;
import dev.flima.backend.domain.service.ProductionService;
import dev.flima.backend.exceptions.ProductNotFound;
import dev.flima.backend.infrastructure.persistence.entity.ProductEntity;
import dev.flima.backend.infrastructure.persistence.entity.ProductMaterialEntity;
import dev.flima.backend.infrastructure.persistence.mapper.product.ProductDTOMapper;
import dev.flima.backend.infrastructure.persistence.mapper.product.ProductMapper;
import dev.flima.backend.interfaces.dto.response.product.ProductWithMaterialsResponseDTO;
import dev.flima.backend.interfaces.dto.response.productMaterial.ProductMaterialResponseDTO;
import dev.flima.backend.interfaces.dto.response.production.ProductionSummaryResponseDTO;
import dev.flima.backend.interfaces.dto.request.product.ProductRequestDTO;
import dev.flima.backend.interfaces.dto.response.product.ProductResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductUseCase {

    @Autowired
    private ProductRepository repository;

    @Autowired
    private RawMaterialRepository materialRepository;

    @Autowired
    private ProductMaterialRepository productMaterialRepository;

    @Autowired
    private ProductionService productionService;

    public List<ProductResponseDTO> findAll() {
        List<ProductEntity> entities = repository.findAll();

        return entities.stream()
                .map(ProductMapper::toDomain)
                .map(ProductDTOMapper::toResponseDTO)
                .toList();
    }

    public ProductResponseDTO findById(Long id) {
        ProductEntity product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFound("product not found"));

        Product pm = ProductMapper.toDomain(product);

        return new ProductResponseDTO(
                pm.getId(),
                pm.getCode(),
                pm.getName(),
                pm.getPrice()
        );
    }

    public ProductResponseDTO create(ProductRequestDTO dto) {
        Product product = new Product();
        product.setCode(dto.getCode());
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());

        ProductEntity pm = ProductMapper.fromDomain(product);

        repository.save(pm);

        return new ProductResponseDTO(
                pm.getId(),
                pm.getCode(),
                pm.getName(),
                pm.getPrice()
        );
    }

    public ProductResponseDTO update(Long id, ProductRequestDTO dto) {
        ProductEntity product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFound("product not found"));

        product.setCode(dto.getCode());
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());

        ProductEntity saved = repository.save(product);

        return new ProductResponseDTO(
                saved.getId(),
                saved.getCode(),
                saved.getName(),
                saved.getPrice()
        );
    }

    public void deleteById(Long id) {
        repository.findById(id)
                .orElseThrow(() -> new ProductNotFound("product not found"));

        repository.deleteById(id);
    }

    public ProductionSummaryResponseDTO suggestion() {
        return productionService.suggestProduction(repository, materialRepository);
    }

    public ProductWithMaterialsResponseDTO findByProductId(Long id) {

        ProductEntity product = productMaterialRepository.findByIdWithMaterials(id)
                .orElseThrow(() -> new ProductNotFound("product not found"));

        List<ProductMaterialResponseDTO> materialsDTO =
                product.getMaterials().stream().map(
                        pm -> new ProductMaterialResponseDTO(
                                pm.getId(),
                                pm.getRawMaterialEntity().getId(),
                                pm.getRawMaterialEntity().getName(),
                                pm.getRequiredQuantity()
                        )
                ).toList();

        return new ProductWithMaterialsResponseDTO(
                product.getId(),
                product.getCode(),
                product.getName(),
                product.getPrice(),
                materialsDTO
        );
    }
}
