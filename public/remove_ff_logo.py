import cv2
import numpy as np
from pathlib import Path
import argparse


def build_parser():
    parser = argparse.ArgumentParser(
        description="Find the F&F logo in images and remove it using inpainting."
    )
    parser.add_argument(
        "--logo",
        type=str,
        required=True,
        help="Path to fflogo.png (template logo).",
    )
    parser.add_argument(
        "--input",
        type=str,
        required=True,
        help="Input image or directory containing images.",
    )
    parser.add_argument(
        "--output",
        type=str,
        required=True,
        help="Output image path (for single image) or directory (for batch).",
    )
    parser.add_argument(
        "--threshold",
        type=float,
        default=0.7,  # works well on your 3,4,7,8,9 samples
        help="Template matching threshold (0–1). Higher = stricter.",
    )
    parser.add_argument(
        "--inpaint-radius",
        type=int,
        default=5,
        help="Inpainting radius used by OpenCV (default 5).",
    )
    return parser


def load_logo_template(logo_path: Path):
    """Load logo template (fflogo.png) and return gray version."""
    logo = cv2.imread(str(logo_path), cv2.IMREAD_UNCHANGED)
    if logo is None:
        raise FileNotFoundError(f"Could not read logo image: {logo_path}")

    # If logo has alpha, keep only RGB for matching.
    if logo.ndim == 3 and logo.shape[2] == 4:
        logo_rgb = cv2.cvtColor(logo, cv2.COLOR_BGRA2BGR)
    else:
        logo_rgb = logo

    template_gray = cv2.cvtColor(logo_rgb, cv2.COLOR_BGR2GRAY)
    return template_gray


def detect_logo_mask_multiscale(
    image_bgr: np.ndarray,
    template_gray: np.ndarray,
    threshold: float = 0.7,
    scales=None,
) -> np.ndarray:
    """
    Detect one or more occurrences of the logo using multi-scale template matching,
    and return a binary mask (255 where logo is, 0 elsewhere).
    """
    if scales is None:
        # You can tune this list if needed
        scales = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0]

    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    H, W = gray.shape
    mask = np.zeros_like(gray, dtype=np.uint8)

    th, tw = template_gray.shape[:2]

    for s in scales:
        new_tw = int(tw * s)
        new_th = int(th * s)

        # Skip unreasonable sizes
        if new_tw < 5 or new_th < 5:
            continue
        if new_tw >= W or new_th >= H:
            continue

        tmpl = cv2.resize(template_gray, (new_tw, new_th), interpolation=cv2.INTER_LINEAR)
        result = cv2.matchTemplate(gray, tmpl, cv2.TM_CCOEFF_NORMED)

        while True:
            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
            if max_val < threshold:
                break

            top_left = max_loc
            bottom_right = (top_left[0] + new_tw, top_left[1] + new_th)

            # Pad a bit around the detected logo
            pad = 4
            x1 = max(top_left[0] - pad, 0)
            y1 = max(top_left[1] - pad, 0)
            x2 = min(bottom_right[0] + pad, W)
            y2 = min(bottom_right[1] + pad, H)

            mask[y1:y2, x1:x2] = 255

            # Suppress this region so we can look for additional occurrences
            result[y1:y2, x1:x2] = -1.0

    return mask


def remove_logo_from_image(
    image_path: Path,
    template_gray: np.ndarray,
    threshold: float = 0.7,
    inpaint_radius: int = 5,
) -> np.ndarray:
    """Return a new image where all detected logos have been inpainted."""
    print(f"[INFO] Processing {image_path}")

    img = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(f"Could not read input image: {image_path}")

    mask = detect_logo_mask_multiscale(img, template_gray, threshold=threshold)
    nonzero = int(np.count_nonzero(mask))
    print(f"[DEBUG] Mask non-zero pixels: {nonzero}")

    # Inpaint only if something was detected
    if nonzero == 0:
        print(f"[INFO] No logo found in {image_path.name}, copying image unchanged.")
        return img

    inpainted = cv2.inpaint(img, mask, inpaint_radius, cv2.INPAINT_TELEA)
    print(f"[OK] Logo removed in {image_path.name}")
    return inpainted


def process_single_image(args, template_gray):
    input_path = Path(args.input)
    output_path = Path(args.output)

    out_img = remove_logo_from_image(
        input_path,
        template_gray,
        threshold=args.threshold,
        inpaint_radius=args.inpaint_radius,
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(output_path), out_img)
    print(f"[OK] Saved cleaned image to {output_path}")


def process_directory(args, template_gray):
    input_dir = Path(args.input)
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    valid_exts = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp"}
    images = [p for p in input_dir.iterdir() if p.suffix.lower() in valid_exts]

    if not images:
        raise RuntimeError(f"No images found in directory {input_dir}")

    for img_path in images:
        out_img = remove_logo_from_image(
            img_path,
            template_gray,
            threshold=args.threshold,
            inpaint_radius=args.inpaint_radius,
        )
        out_path = output_dir / img_path.name
        cv2.imwrite(str(out_path), out_img)
        print(f"   → saved to {out_path}")


def main():
    print("[DEBUG] Script started")
    parser = build_parser()
    args = parser.parse_args()

    logo_path = Path(args.logo)
    template_gray = load_logo_template(logo_path)

    input_path = Path(args.input)

    if input_path.is_dir():
        process_directory(args, template_gray)
    else:
        process_single_image(args, template_gray)


if __name__ == "__main__":
    main()
