package dev.flima.backend.interfaces.rest;

import dev.flima.backend.application.useCase.RawMaterialUseCase;
import dev.flima.backend.interfaces.dto.request.rawMaterials.RawMaterialRequestDTO;
import dev.flima.backend.interfaces.dto.response.rawMaterial.RawMaterialResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/raw-materials")
public class RawMaterialController {

    @Autowired
    private RawMaterialUseCase useCase;

    @GetMapping
    public ResponseEntity<List<RawMaterialResponseDTO>> findAll() {
        return ResponseEntity.ok(useCase.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RawMaterialResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(useCase.findById(id));
    }

    @PostMapping
    public ResponseEntity<RawMaterialResponseDTO> save(@RequestBody RawMaterialRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(useCase.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RawMaterialResponseDTO> update(@PathVariable Long id, @RequestBody RawMaterialRequestDTO request) {
        return ResponseEntity.ok(useCase.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        useCase.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
