describe("Produtos (E2E com backend real) - data-cy (robusto)", () => {
  const PAGE = "/products";

  const apiBase = () => Cypress.env("API_URL");

  const endpoints = {
    products: () => `${apiBase()}/products`,
    productById: (id) => `${apiBase()}/products/${id}`,
    materials: () => `${apiBase()}/raw-materials`,
  };

  const uniqueCode = () => `CY-${Date.now()}`;
  const toPriceStr = (n) => Number(n).toFixed(2);

  function createProductViaApi({ code, name, price }) {
    return cy.request({
      method: "POST",
      url: endpoints.products(),
      body: { code, name, price: toPriceStr(price) },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status, "status create product").to.be.within(200, 299);
      return res;
    });
  }

  function listProductsViaApi() {
    return cy.request({
      method: "GET",
      url: endpoints.products(),
    }).then((res) => {
      expect(res.status, "status list products").to.eq(200);
      return res.body || [];
    });
  }

  function findProductIdByCode(code) {
    return listProductsViaApi().then((products) => {
      const found = products.find((p) => p.code === code);
      expect(found, `produto com code=${code} existe no backend`).to.exist;
      expect(found.id, "found.id").to.exist;
      return found.id;
    });
  }

  function deleteProductViaApi(id) {
    return cy.request({
      method: "DELETE",
      url: endpoints.productById(id),
      failOnStatusCode: false,
    });
  }

  function listMaterialsViaApi() {
    return cy.request({
      method: "GET",
      url: endpoints.materials(),
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status, "status list materials").to.be.within(200, 299);
      return res.body || [];
    });
  }

  function openCreateModal() {
    cy.get('[data-cy="btn-new-product"]').click();
    cy.get('[data-cy="modal-product"]').should("be.visible");
  }

  function fillProductForm({ code, name, price }) {
    if (code != null) cy.get('[data-cy="input-code"]').clear().type(code);
    if (name != null) cy.get('[data-cy="input-name"]').clear().type(name);
    if (price != null) cy.get('[data-cy="input-price"]').clear().type(String(price));
  }

  function submitProductForm() {
    cy.get('[data-cy="btn-submit-product"]').click();
  }

  function waitRowVisible(productId) {
    cy.get(`[data-cy="product-row-${productId}"]`, { timeout: 15000 }).should("be.visible");
  }

  function openEditModalByRowId(productId) {
    waitRowVisible(productId);
    cy.get(`[data-cy="product-row-${productId}"]`).within(() => {
      cy.get('[data-cy="btn-edit-product"]').click();
    });
    cy.get('[data-cy="modal-product"]').should("be.visible");
    cy.get('[data-cy="modal-title"]').should("contain.text", "Editar Produto");
  }

  function deleteByRowId(productId) {
    waitRowVisible(productId);
    cy.get(`[data-cy="product-row-${productId}"]`).within(() => {
      cy.get('[data-cy="btn-delete-product"]').click();
    });
  }

  beforeEach(() => {
    cy.visit(PAGE);
    cy.get('[data-cy="products-page"]').should("be.visible");
  });

  it("deve criar um produto (UI) e aparecer na tabela", () => {
    const code = uniqueCode();
    const name = "Produto Cypress";
    const price = 12.34;
    const expected = price.toFixed(2);
    const [int, dec] = expected.split(".");
    const priceRegex = new RegExp(`R\\$\\s*${int}[,\\.]${dec}`);

    openCreateModal();
    fillProductForm({ code, name, price });
    submitProductForm();

    cy.get('[data-cy="modal-product"]').should("not.exist");

    cy.get('[data-cy="products-table"]', { timeout: 15000 }).should("be.visible");

    cy.get('[data-cy="products-table"]').within(() => {
      cy.contains(code, { timeout: 15000 }).should("be.visible");
      cy.contains(name).should("be.visible");
      cy.contains(priceRegex).should("be.visible");
    });

    findProductIdByCode(code).then((id) => deleteProductViaApi(id));
  });

  it("deve editar um produto (seed via API e UI edita)", () => {
    const code = uniqueCode();
    const createdName = "Produto Editar";
    const createdPrice = 10.0;

    const updatedName = "Produto Editado";
    const updatedPrice = 75.0;

    createProductViaApi({ code, name: createdName, price: createdPrice })
      .then(() => findProductIdByCode(code))
      .then((productId) => {
        cy.visit(PAGE);

        openEditModalByRowId(productId);

        cy.get('[data-cy="input-code"]').should("be.disabled");

        fillProductForm({ name: updatedName, price: updatedPrice });
        submitProductForm();

        cy.get('[data-cy="modal-product"]').should("not.exist");

        waitRowVisible(productId);
        cy.get(`[data-cy="product-row-${productId}"]`).within(() => {
          cy.get('[data-cy="product-code"]').should("contain.text", code);
          cy.get('[data-cy="product-name"]').should("contain.text", updatedName);
          cy.get('[data-cy="product-price"]').should(
            "contain.text",
            new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(updatedPrice)
          );
        });

        deleteProductViaApi(productId);
      });
  });

  it("deve excluir um produto (seed via API e UI exclui)", () => {
    const code = uniqueCode();
    const name = "Produto Excluir";
    const price = 1.23;

    createProductViaApi({ code, name, price })
      .then(() => findProductIdByCode(code))
      .then((productId) => {
        cy.visit(PAGE);

        deleteByRowId(productId);

        cy.get(`[data-cy="product-row-${productId}"]`, { timeout: 15000 }).should("not.exist");

        deleteProductViaApi(productId);
      });
  });

  it("deve adicionar, editar e remover associação de matéria-prima no modal", () => {
    const code = uniqueCode();
    const name = "Produto Assoc";
    const price = 20.0;

    let materialId;

    listMaterialsViaApi()
      .then((materials) => {
        expect(materials.length, "materiais disponíveis").to.be.greaterThan(0);
        materialId = materials[0].id;
        expect(materialId, "materialId").to.exist;
      })
      .then(() => createProductViaApi({ code, name, price }))
      .then(() => findProductIdByCode(code))
      .then((productId) => {
        cy.visit(PAGE);
        openEditModalByRowId(productId);

        cy.get('[data-cy="association-section"]').should("be.visible");

        cy.get('[data-cy="select-material"]').select(String(materialId));
        cy.get('[data-cy="input-required-quantity"]').clear().type("2");
        cy.get('[data-cy="btn-save-association"]').click();

        cy.get('[data-cy="association-list"]')
          .find('[data-cy^="assoc-item-"]', { timeout: 15000 })
          .should("have.length.at.least", 1)
          .first()
          .invoke("attr", "data-cy")
          .then((attr) => {
            const assocId = Number(String(attr).replace("assoc-item-", ""));
            expect(assocId, "assocId").to.be.a("number");

            const assocSelector = `[data-cy="assoc-item-${assocId}"]`;

            cy.get(assocSelector).find('[data-cy="assoc-text"]').should("contain.text", "2");

            cy.get(assocSelector).within(() => {
              cy.get('[data-cy="btn-edit-assoc"]').click();
            });

            cy.get('[data-cy="select-material"]').should("be.disabled");
            cy.get('[data-cy="input-required-quantity"]').clear().type("5");
            cy.get('[data-cy="btn-save-association"]').click();

            cy.get(assocSelector).find('[data-cy="assoc-text"]').should("contain.text", "5");

            cy.get(assocSelector).within(() => {
              cy.get('[data-cy="btn-delete-assoc"]').click();
            });

            cy.get(assocSelector).should("not.exist");
          })
          .then(() => {

            return findProductIdByCode(code).then((id) => deleteProductViaApi(id));
          });
      });
  });
});