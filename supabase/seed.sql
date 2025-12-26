-- SAMPLE PRODUCTS (Corteiz Vibe)
-- Insert Products
INSERT INTO public.products (id, title, description, slug, base_price, images)
VALUES (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'OG Alcatraz Tee [Black/Yellow]',
        'Heavyweight cotton tee with iconic Alcatraz print. Standard fit.',
        'og-alcatraz-tee-black-yellow',
        1500,
        ARRAY ['/products/tee-black.jpg']
    ),
    (
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        'Superior Royale Zip Hoodie',
        'Full zip hoodie with embroidered chest logo. Blackout edition.',
        'superior-royale-zip-hoodie',
        3900,
        ARRAY ['/products/hoodie-black.jpg']
    ),
    (
        'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        'Guerilla Cargo Pants [Camo]',
        'Utility cargo pants with 6 pockets and adjustable ankle. Woodland camo.',
        'guerilla-cargo-pants-camo',
        4200,
        ARRAY ['/products/cargo-camo.jpg']
    ),
    (
        'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
        'Rules The World Beanie',
        'Knit beanie with patch logo. One size.',
        'rtw-beanie-grey',
        900,
        ARRAY ['/products/beanie-grey.jpg']
    );
-- Insert Variants (Inventory)
-- Tee
INSERT INTO public.product_variants (product_id, size, color, stock_quantity)
VALUES (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'S',
        'Black/Yellow',
        10
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'M',
        'Black/Yellow',
        20
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'L',
        'Black/Yellow',
        15
    ),
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'XL',
        'Black/Yellow',
        5
    );
-- Hoodie
INSERT INTO public.product_variants (product_id, size, color, stock_quantity)
VALUES (
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        'M',
        'Black',
        10
    ),
    (
        'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
        'L',
        'Black',
        10
    );
-- Cargo
INSERT INTO public.product_variants (product_id, size, color, stock_quantity)
VALUES (
        'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        '30',
        'Camo',
        8
    ),
    (
        'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        '32',
        'Camo',
        12
    ),
    (
        'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
        '34',
        'Camo',
        10
    );
-- Beanie
INSERT INTO public.product_variants (product_id, size, color, stock_quantity)
VALUES (
        'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
        'OS',
        'Grey',
        50
    );