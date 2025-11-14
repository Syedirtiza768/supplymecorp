import cv2
import numpy as np
from pathlib import Path
import argparse
import sys


def build_parser():
    parser = argparse.ArgumentParser(
        description="Remove F&F logo and bottom ribbon from flyer images."
    )
    parser.add_argument(
        "--logo",
        type=str,
        required=True,
        help="Path to fflogo.png (template logo).",
    )
    parser.add_argument(
        "--ribbon",
        type=str,
        required=True,
        help="Path to blackribbon.png (bottom ribbon template).",
    )
    parser.add_argument(
        "--input",
        type=str,
        required=True,
        help="Input image file OR directory containing images.",
    )
    parser.add_argument(
        "--output",
        type=str,
        required=True,
        help="Output image path (for single image) OR directory (for batch).",
    )
    parser.add_argument(
        "--threshold",
        type=float,
        default=0.7,
        help="Template matching threshold for logo (0–1). Higher = stricter.",
    )
    parser.add_argument(
        "--ribbon-threshold",
        type=float,
        default=0.6,
        help="Template matching threshold for ribbon (0–1).",
    )
    parser.add_argument(
        "--inpaint-radius",
        type=int,
        default=5,
        help="Inpainting radius used by OpenCV (default 5).",
    )
    return parser


# ----------------- Template loading helpers ----------------- #

def load_logo_template(logo_path: Path) -> np.ndarray:
    """Load logo template (fflogo.png) and return gray version."""
    logo = cv2.imread(str(logo_path), cv2.IMREAD_UNCHANGED)
    if logo is None:
        raise FileNotFoundError(f"Could not read logo image: {logo_path}")

    if logo.ndim == 3 and logo.shape[2] == 4:
        logo_rgb = cv2.cvtColor(logo, cv2.COLOR_BGRA2BGR)
    else:
        logo_rgb = logo

    template_gray = cv2.cvtColor(logo_rgb, cv2.COLOR_BGR2GRAY)
    return template_gray


def load_ribbon_template(ribbon_path: Path) -> np.ndarray:
    """Load ribbon template (blackribbon.png) and return gray version."""
    ribbon = cv2.imread(str(ribbon_path), cv2.IMREAD_UNCHANGED)
    if ribbon is None:
        raise FileNotFoundError(f"Could not read ribbon image: {ribbon_path}")

    if ribbon.ndim == 3 and ribbon.shape[2] == 4:
        ribbon_rgb = cv2.cvtColor(ribbon, cv2.COLOR_BGRA2BGR)
    else:
        ribbon_rgb = ribbon

    ribbon_gray = cv2.cvtColor(ribbon_rgb, cv2.COLOR_BGR2GRAY)
    return ribbon_gray


# ----------------- Logo detection (multi-scale) ----------------- #

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
        scales = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0]

    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    H, W = gray.shape
    mask = np.zeros_like(gray, dtype=np.uint8)

    th, tw = template_gray.shape[:2]

    for s in scales:
        new_tw = int(tw * s)
        new_th = int(th * s)

        if new_tw < 5 or new_th < 5:
            continue
        if new_tw >= W or new_th >= H:
            continue

        tmpl = cv2.resize(template_gray, (new_tw, new_th), interpolation=cv2.INTER_LINEAR)
        result = cv2.matchTemplate(gray, tmpl, cv2.TM_CCOEFF_NORMED)

        while True:
            _, max_val, _, max_loc = cv2.minMaxLoc(result)
            if max_val < threshold:
                break

            top_left = max_loc
            bottom_right = (top_left[0] + new_tw, top_left[1] + new_th)

            pad = 4
            x1 = max(top_left[0] - pad, 0)
            y1 = max(top_left[1] - pad, 0)
            x2 = min(bottom_right[0] + pad, W)
            y2 = min(bottom_right[1] + pad, H)

            mask[y1:y2, x1:x2] = 255
            result[y1:y2, x1:x2] = -1.0  # suppress this area

    return mask


# ----------------- Ribbon detection using blackribbon.png ----------------- #

def _fallback_remove_bottom_dark_band(img_bgr: np.ndarray) -> np.ndarray:
    """
    Fallback: detect the dark band at the bottom by brightness and remove it.
    Used when template matching fails.
    """
    H, W = img_bgr.shape[:2]
    N = min(200, H)  # inspect last N rows
    roi = img_bgr[H - N : H, :, :]
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    row_means = gray.mean(axis=1)

    # Find first dark row from the bottom
    start = None
    for i in range(N - 1, -1, -1):
        if row_means[i] < 200:  # darker than almost-white background
            start = i
            break

    if start is None:
        print("[INFO] Fallback: no dark band detected at bottom.")
        return img_bgr

    top_local = start
    for i in range(start, -1, -1):
        if row_means[i] < 200:
            top_local = i
        else:
            break

    y_top = H - N + top_local
    cv2.rectangle(img_bgr, (0, y_top), (W - 1, H - 1), (255, 255, 255), thickness=-1)
    print(f"[OK] Fallback removed bottom band from rows {y_top} to {H-1}")
    return img_bgr


def remove_ribbon_with_template(
    img_bgr: np.ndarray,
    ribbon_gray: np.ndarray,
    threshold: float = 0.6,
) -> np.ndarray:
    """
    Use blackribbon.png as a template to find the bottom ribbon and remove it
    by painting the area white. If the match is weak, fall back to brightness-based
    detection.
    """
    H, W = img_bgr.shape[:2]
    rh, rw = ribbon_gray.shape[:2]

    # Scale the ribbon template to match page width
    scale = W / float(rw)
    new_h = max(5, int(round(rh * scale)))
    resized_ribbon = cv2.resize(ribbon_gray, (W, new_h), interpolation=cv2.INTER_LINEAR)

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    # Search only in the lower half of the image to avoid false matches
    search_top = H // 2
    search_region = gray[search_top:H, :]

    result = cv2.matchTemplate(search_region, resized_ribbon, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, max_loc = cv2.minMaxLoc(result)
    print(f"[DEBUG] Ribbon match value: {max_val:.3f}")

    if max_val < threshold:
        print("[INFO] Ribbon template match below threshold; using fallback detector.")
        return _fallback_remove_bottom_dark_band(img_bgr)

    # result has width 1 because template width == image width
    top_local_y = max_loc[1]
    band_top = search_top + top_local_y

    # Paint from band_top to bottom white
    cv2.rectangle(img_bgr, (0, band_top), (W - 1, H - 1), (255, 255, 255), thickness=-1)
    print(f"[OK] Bottom ribbon removed from rows {band_top} to {H-1}")
    return img_bgr


# ----------------- Main per-image processing ----------------- #

def remove_logo_and_ribbon_from_image(
    image_path: Path,
    logo_template_gray: np.ndarray,
    ribbon_template_gray: np.ndarray,
    logo_threshold: float = 0.7,
    ribbon_threshold: float = 0.6,
    inpaint_radius: int = 5,
) -> np.ndarray:
    """Return a new image where the logo is removed and the bottom ribbon is erased."""
    print(f"[INFO] Processing {image_path}")

    img = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(f"Could not read input image: {image_path}")

    # 1) Remove logo(s)
    mask = detect_logo_mask_multiscale(img, logo_template_gray, threshold=logo_threshold)
    nonzero = int(np.count_nonzero(mask))
    print(f"[DEBUG] Logo mask non-zero pixels: {nonzero}")

    if nonzero > 0:
        img = cv2.inpaint(img, mask, inpaint_radius, cv2.INPAINT_TELEA)
        print(f"[OK] Logo inpainted for {image_path.name}")
    else:
        print(f"[INFO] No logo found in {image_path.name}; skipping logo inpainting.")

    # 2) Remove bottom ribbon using blackribbon template (+ fallback)
    img = remove_ribbon_with_template(img, ribbon_template_gray, threshold=ribbon_threshold)

    return img


# ----------------- Bulk processing helpers ----------------- #

def process_single_image(args, logo_template_gray, ribbon_template_gray):
    input_path = Path(args.input)
    output_path = Path(args.output)

    out_img = remove_logo_and_ribbon_from_image(
        input_path,
        logo_template_gray,
        ribbon_template_gray,
        logo_threshold=args.threshold,
        ribbon_threshold=args.ribbon_threshold,
        inpaint_radius=args.inpaint_radius,
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(output_path), out_img)
    print(f"[OK] Saved cleaned image to {output_path}")


def process_directory(args, logo_template_gray, ribbon_template_gray):
    input_dir = Path(args.input)
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    valid_exts = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp"}
    images = [p for p in input_dir.iterdir() if p.suffix.lower() in valid_exts]

    if not images:
        raise RuntimeError(f"No images found in directory {input_dir}")

    for img_path in images:
        out_img = remove_logo_and_ribbon_from_image(
            img_path,
            logo_template_gray,
            ribbon_template_gray,
            logo_threshold=args.threshold,
            ribbon_threshold=args.ribbon_threshold,
            inpaint_radius=args.inpaint_radius,
        )
        out_path = output_dir / img_path.name
        cv2.imwrite(str(out_path), out_img)
        print(f"   → saved to {out_path}")


def main():
    print("[DEBUG] Script started; argv =", sys.argv)
    parser = build_parser()
    args = parser.parse_args()
    print("[DEBUG] Parsed args:", args)

    logo_path = Path(args.logo)
    ribbon_path = Path(args.ribbon)

    logo_template_gray = load_logo_template(logo_path)
    ribbon_template_gray = load_ribbon_template(ribbon_path)

    input_path = Path(args.input)

    if input_path.is_dir():
        process_directory(args, logo_template_gray, ribbon_template_gray)
    else:
        process_single_image(args, logo_template_gray, ribbon_template_gray)


if __name__ == "__main__":
    main()
