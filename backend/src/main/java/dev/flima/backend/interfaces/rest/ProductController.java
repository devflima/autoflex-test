package dev.flima.backend.interfaces.rest;

import dev.flima.backend.application.useCase.ProductUseCase;
import dev.flima.backend.interfaces.dto.response.product.ProductWithMaterialsResponseDTO;
import dev.flima.backend.interfaces.dto.response.production.ProductionSummaryResponseDTO;
import dev.flima.backend.interfaces.dto.request.product.ProductRequestDTO;
import dev.flima.backend.interfaces.dto.response.product.ProductResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductUseCase useCase;

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAll() {
        return ResponseEntity.ok(useCase.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(useCase.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProductResponseDTO> save(@RequestBody ProductRequestDTO product) {
        return ResponseEntity.status(HttpStatus.CREATED).body(useCase.create(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> update(@PathVariable Long id, @RequestBody ProductRequestDTO product) {
        return ResponseEntity.ok(useCase.update(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        useCase.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ProductionSummaryResponseDTO>  getSuggestions() {
        return ResponseEntity.ok(useCase.suggestion());
    }

    @GetMapping("/materials/{id}")
    public ResponseEntity<ProductWithMaterialsResponseDTO> findByProductId(@PathVariable Long id) {
        return ResponseEntity.ok(useCase.findByProductId(id));
    }

}
