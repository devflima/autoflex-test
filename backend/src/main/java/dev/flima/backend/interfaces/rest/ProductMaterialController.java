package dev.flima.backend.interfaces.rest;

import dev.flima.backend.application.useCase.ProductMaterialUseCase;
import dev.flima.backend.interfaces.dto.request.productMaterials.ProductMaterialRequestDTO;
import dev.flima.backend.interfaces.dto.response.productMaterial.ProductMaterialResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-materials")
public class ProductMaterialController {

    @Autowired
    private ProductMaterialUseCase useCase;

    @GetMapping
    public ResponseEntity<List<ProductMaterialResponseDTO>> findAll() {
        return ResponseEntity.ok(useCase.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductMaterialResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(useCase.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProductMaterialResponseDTO> save(@RequestBody ProductMaterialRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(useCase.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductMaterialResponseDTO> update(@PathVariable Long id, @RequestBody ProductMaterialRequestDTO dto) {
        return ResponseEntity.ok(useCase.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        useCase.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
