import os
from PIL import Image, ImageDraw

def remove_background(input_path, output_path):
    # Open image and convert to RGBA
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # Create a mask for transparency (starts as fully opaque)
    mask = Image.new("L", (width, height), 255)
    
    # We will perform a flood fill from all four corners and along the borders to identify the background.
    # The background seems to be greyish. Let's find pixels close to the border colors.
    # Let's use a flood fill with a tolerance.
    # Since PIL's floodfill doesn't support tolerance out of the box easily, we can implement a simple BFS flood fill
    # or use standard image thresholding. Let's check the color distribution first or write a custom flood fill.
    
    pixels = img.load()
    visited = set()
    queue = []
    
    # Add all border pixels to the queue
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
        visited.add((x, 0))
        visited.add((x, height - 1))
        
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))
        visited.add((0, y))
        visited.add((width - 1, y))
        
    # We want to check if the color is close to the typical background.
    # Let's say a pixel is background if it's close to the border colors.
    # Let's define a helper to check if a pixel is background-like.
    # Usually, the background is gray, meaning R, G, B are similar and close to the border values.
    # Let's inspect the average color of the seed pixels in the queue.
    seed_colors = [pixels[x, y] for x, y in queue]
    avg_r = sum(c[0] for c in seed_colors) / len(seed_colors)
    avg_g = sum(c[1] for c in seed_colors) / len(seed_colors)
    avg_b = sum(c[2] for c in seed_colors) / len(seed_colors)
    
    print(f"Seed average: {avg_r:.1f}, {avg_g:.1f}, {avg_b:.1f}")
    
    # BFS flood fill
    bg_mask = Image.new("L", (width, height), 255)
    mask_pixels = bg_mask.load()
    
    # A pixel is considered part of the background if its color distance to the local neighborhood
    # or the average background color is within a threshold.
    # Let's use distance to the average border color.
    threshold = 85  # Adjust this threshold if needed
    
    # Let's do a flood fill.
    head = 0
    while head < len(queue):
        x, y = queue[head]
        head += 1
        
        # Mark as background (0 in mask means transparent)
        mask_pixels[x, y] = 0
        
        # Check 4-connected neighbors
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited:
                    # Check color similarity
                    nr, ng, nb, _ = pixels[nx, ny]
                    # Distance to average background color
                    dist = ((nr - avg_r)**2 + (ng - avg_g)**2 + (nb - avg_b)**2)**0.5
                    
                    # Also check if it's close to grey/monochrome (since background is grey)
                    # and check distance
                    if dist < threshold:
                        visited.add((nx, ny))
                        queue.append((nx, ny))
                        
    # Apply mask to image
    # We can also apply a slight feather/blur to the mask to avoid jagged edges.
    from PIL import ImageFilter
    # Smooth the mask slightly to feather the edges
    bg_mask = bg_mask.filter(ImageFilter.MinFilter(3)) # Erode slightly to remove border halos
    bg_mask = bg_mask.filter(ImageFilter.GaussianBlur(1.5))
    
    # Put the mask into the alpha channel of the original image
    img.putalpha(bg_mask)
    
    # Save the image as PNG
    img.save(output_path, "PNG")
    print(f"Saved transparent image to {output_path}")

if __name__ == '__main__':
    remove_background("assets/logo.jpg", "assets/logo.png")
