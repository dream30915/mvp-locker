-- Update images to real Unsplash URLs that match the streetwear aesthetic
-- 1. OG Alcatraz Tee (Black/Yellow vibe)
UPDATE public.products
SET images = ARRAY ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop']
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
-- 2. Superior Royale Zip Hoodie (Black Hoodie)
UPDATE public.products
SET images = ARRAY ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop']
WHERE id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12';
-- 3. Guerilla Cargo Pants (Camo/Tactical)
UPDATE public.products
SET images = ARRAY ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop']
WHERE id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13';
-- 4. Rules The World Beanie
UPDATE public.products
SET images = ARRAY ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1000&auto=format&fit=crop']
WHERE id = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14';