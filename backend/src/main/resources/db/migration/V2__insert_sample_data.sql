INSERT INTO products (code, name, price)
VALUES ('P001', 'Pão Francês', 0.80);

INSERT INTO products (code, name, price)
VALUES ('P002', 'Bolo de Chocolate', 25.00);

INSERT INTO products (code, name, price)
VALUES ('P003', 'Pizza Mussarela', 45.00);

INSERT INTO products (code, name, price)
VALUES ('P004', 'Croissant', 8.50);

INSERT INTO raw_materials (code, name, stock_quantity)
VALUES ('RM001', 'Farinha de Trigo (kg)', 500);

INSERT INTO raw_materials (code, name, stock_quantity)
VALUES ('RM002', 'Fermento Biológico (kg)', 50);

INSERT INTO raw_materials (code, name, stock_quantity)
VALUES ('RM003', 'Açúcar (kg)', 200);

INSERT INTO raw_materials (code, name, stock_quantity)
VALUES ('RM004', 'Chocolate em Pó (kg)', 120);

INSERT INTO raw_materials (code, name, stock_quantity)
VALUES ('RM005', 'Queijo Mussarela (kg)', 150);

INSERT INTO raw_materials (code, name, stock_quantity)
VALUES ('RM006', 'Molho de Tomate (litro)', 180);

INSERT INTO raw_materials (code, name, stock_quantity)
VALUES ('RM007', 'Manteiga (kg)', 100);

INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
VALUES (
           (SELECT id FROM products WHERE code = 'P001'),
           (SELECT id FROM raw_materials WHERE code = 'RM001'),
           0.10
       );

INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
VALUES (
           (SELECT id FROM products WHERE code = 'P001'),
           (SELECT id FROM raw_materials WHERE code = 'RM002'),
           0.01
       );

INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
VALUES (
           (SELECT id FROM products WHERE code = 'P002'),
           (SELECT id FROM raw_materials WHERE code = 'RM001'),
           1.50
       );

INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
VALUES (
           (SELECT id FROM products WHERE code = 'P002'),
           (SELECT id FROM raw_materials WHERE code = 'RM003'),
           0.80
       );

INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
VALUES (
           (SELECT id FROM products WHERE code = 'P002'),
           (SELECT id FROM raw_materials WHERE code = 'RM004'),
           0.50
       );

INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
VALUES (
           (SELECT id FROM products WHERE code = 'P003'),
           (SELECT id FROM raw_materials WHERE code = 'RM001'),
           0.50
       );

INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
VALUES (
           (SELECT id FROM products WHERE code = 'P003'),
           (SELECT id FROM raw_materials WHERE code = 'RM005'),
           0.70
       );

INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
VALUES (
           (SELECT id FROM products WHERE code = 'P003'),
           (SELECT id FROM raw_materials WHERE code = 'RM006'),
           0.30
       );

INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
VALUES (
           (SELECT id FROM products WHERE code = 'P004'),
           (SELECT id FROM raw_materials WHERE code = 'RM001'),
           0.20
       );

INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
VALUES (
           (SELECT id FROM products WHERE code = 'P004'),
           (SELECT id FROM raw_materials WHERE code = 'RM007'),
           0.15
       );

COMMIT;