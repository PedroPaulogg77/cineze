import os
from PIL import Image

src_dir = r"e:\cineze-site-feito-main\PRINTS DASHBOARD"
dest_dir = r"e:\cineze-site-feito-main\src\assets\mockups"

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

for file in os.listdir(src_dir):
    if file.endswith('.png'):
        img_path = os.path.join(src_dir, file)
        
        # Format filename, replace spaces with hyphens, lowercase
        dest_filename = file.replace('.png', '.webp').replace(' - ', '-').replace(' ', '-').lower()
        dest_path = os.path.join(dest_dir, dest_filename)
        
        img = Image.open(img_path)
        img = img.convert('RGBA')  # Preserve transparency
        
        # Save as WEBP with 85 quality
        img.save(dest_path, 'webp', quality=85)
        print(f"Converted {file} to {dest_filename}")
