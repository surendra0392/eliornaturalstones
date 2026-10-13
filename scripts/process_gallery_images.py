import os
import cv2
import numpy as np

SOURCE_DIR = r"E:\Elior Natural Stones\Categories & Images\Italian marble\new\Sample"
OUTPUT_DIR = r"d:\Herd\eliornaturalstones\public\images\elior\gallery"
TARGET_WIDTH = 1500
TARGET_HEIGHT = 1200

os.makedirs(OUTPUT_DIR, exist_ok=True)

def resize_final(img):
    assert img.shape[0] > 0 and img.shape[1] > 0, "Invalid crop dimensions"
    return cv2.resize(img, (TARGET_WIDTH, TARGET_HEIGHT), interpolation=cv2.INTER_LANCZOS4)

def process_image(src_name, recipe_func):
    path = os.path.join(SOURCE_DIR, src_name)
    img = cv2.imread(path)
    if img is None:
        raise FileNotFoundError(f"Could not load image: {path}")
    cleaned = recipe_func(img)
    final = resize_final(cleaned)
    assert final.shape[:2] == (TARGET_HEIGHT, TARGET_WIDTH), f"Bad shape: {final.shape}"
    return final

# --- Recipes ---

def recipe_1(img):
    # (1024, 768) -> crop x: 32..992 (960x768, 5:4)
    return img[:, 32:992]

def recipe_2(img):
    # (1365, 768) -> crop x: 355..1315 (960x768, 5:4) excludes barcode and sparkle
    return img[:, 355:1315]

def recipe_3(img):
    # (1365, 768) -> crop x: 180..1140 (960x768, 5:4) excludes BR sparkle
    return img[:, 180:1140]

def recipe_4(img):
    # (1024, 768) -> crop x: 32..992 (960x768, 5:4)
    return img[:, 32:992]

def recipe_5(img):
    # (1090, 1600) -> crop y: 280..1152 (1090x872, 5:4)
    return img[280:1152, :]

def recipe_6(img):
    # (1142, 1600) -> crop y: 450..1363 (1142x913, 5:4)
    return img[450:1363, :]

def recipe_7(img):
    # (1536, 1024) -> soffit logo at [30:175, 45:190]
    # seamless clone patch from [30:175, 230:375] to (117, 102)
    h, w = img.shape[:2]
    patch = img[30:175, 230:375].copy()
    mask = np.full(patch.shape, 255, dtype=np.uint8)
    clone = cv2.seamlessClone(patch, img, mask, (117, 102), cv2.NORMAL_CLONE)
    # Center crop x: 128..1408 (1280x1024, 5:4)
    return clone[:, 128:1408]

def recipe_8(img):
    # (1536, 1024) -> logo in center [435:600, 680:855]
    patch = img[435:600, 875:1050].copy()
    mask = np.zeros((patch.shape[0], patch.shape[1]), dtype=np.uint8)
    cv2.ellipse(mask, (patch.shape[1]//2, patch.shape[0]//2), (75, 70), 0, 0, 360, 255, -1)
    mask_3c = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
    clone = cv2.seamlessClone(patch, img, mask_3c, (767, 517), cv2.NORMAL_CLONE)
    # Center crop x: 128..1408
    return clone[:, 128:1408]

def recipe_9(img):
    # (1536, 1024) -> logo in center [420:600, 680:860]
    patch = img[420:600, 930:1110].copy()
    mask = np.zeros((patch.shape[0], patch.shape[1]), dtype=np.uint8)
    cv2.ellipse(mask, (patch.shape[1]//2, patch.shape[0]//2), (80, 80), 0, 0, 360, 255, -1)
    mask_3c = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
    clone = cv2.seamlessClone(patch, img, mask_3c, (770, 510), cv2.NORMAL_CLONE)
    return clone[:, 128:1408]

def recipe_10(img):
    # (1536, 1024) -> logo in center [420:600, 680:860]
    patch = img[420:600, 930:1110].copy()
    mask = np.zeros((patch.shape[0], patch.shape[1]), dtype=np.uint8)
    cv2.ellipse(mask, (patch.shape[1]//2, patch.shape[0]//2), (80, 80), 0, 0, 360, 255, -1)
    mask_3c = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
    clone = cv2.seamlessClone(patch, img, mask_3c, (770, 510), cv2.NORMAL_CLONE)
    return clone[:, 128:1408]

def recipe_11(img):
    # (1280, 784) -> logo on floor [650:770, 520:760]
    patch = img[650:770, 260:500].copy()
    mask = np.zeros((patch.shape[0], patch.shape[1]), dtype=np.uint8)
    cv2.ellipse(mask, (patch.shape[1]//2, patch.shape[0]//2), (105, 50), 0, 0, 360, 255, -1)
    mask_3c = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
    clone = cv2.seamlessClone(patch, img, mask_3c, (640, 710), cv2.NORMAL_CLONE)
    # 5:4 crop: width = 784 * 1.25 = 980. x: 150..1130
    return clone[:, 150:1130]

def recipe_12(img):
    # (1024, 768) -> crop x: 40..1000 (960x768, 5:4) excludes sparkle at right
    return img[:, 40:1000]

def recipe_13(img):
    # (1195, 896) -> brass plaque at [450:525, 780:855]
    patch = img[450:525, 865:950].copy()
    mask = np.zeros((patch.shape[0], patch.shape[1]), dtype=np.uint8)
    cv2.rectangle(mask, (5, 5), (patch.shape[1]-5, patch.shape[0]-5), 255, -1)
    mask_3c = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
    clone = cv2.seamlessClone(patch, img, mask_3c, (812, 487), cv2.NORMAL_CLONE)
    # Crop to 5:4: 896 * 1.25 = 1120. Crop x: 0..1120 (excludes right 75px sparkle)
    return clone[:, 0:1120]

def recipe_14(img):
    # (1195, 896) -> crop x: 37..1157 (1120x896, 5:4)
    return img[:, 37:1157]

def recipe_15(img):
    # (896, 1195) -> crop y: 240..956 (896x716, 5:4) excludes top logo and bottom sparkle
    return img[240:956, :]

def recipe_16(img):
    # (1195, 896) -> inpaint top-left window logo [55:165, 55:165]
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    mask[55:165, 55:165] = 255
    inpainted = cv2.inpaint(img, mask, inpaintRadius=5, flags=cv2.INPAINT_TELEA)
    # Crop x: 0..1120 (1120x896, 5:4) excludes bottom-right sparkle
    return inpainted[:, 0:1120]

def recipe_17(img):
    # (896, 1195) -> crop y: 240..956 (896x716, 5:4) excludes top JSB and bottom sparkle
    return img[240:956, :]

def recipe_18(img):
    # (1306, 816) -> crop x: 100..1120 (1020x816, 5:4) excludes JSB and sparkle
    return img[:, 100:1120]

def recipe_19(img):
    # (768, 1365) -> crop y: 400..1014 (768x614, 5:4) excludes JSB and sparkle
    return img[400:1014, :]

def recipe_20(img):
    # (1365, 768) -> JSB plaque on credenza at [475:512, 105:158]
    patch = img[475:512, 180:233].copy()
    mask = np.zeros((patch.shape[0], patch.shape[1]), dtype=np.uint8)
    cv2.rectangle(mask, (5, 5), (patch.shape[1]-5, patch.shape[0]-5), 255, -1)
    mask_3c = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
    clone = cv2.seamlessClone(patch, img, mask_3c, (131, 493), cv2.NORMAL_CLONE)
    # Crop x: 180..1140 (960x768, 5:4)
    return clone[:, 180:1140]

def recipe_21(img):
    # (1365, 768) -> crop x: 200..1160 (960x768, 5:4) excludes sparkle
    return img[:, 200:1160]

def recipe_22(img):
    # (960, 1113) -> crop y: 170..938 (960x768, 5:4) excludes sparkle
    return img[170:938, :]

def recipe_23(img):
    # (1402, 1122) -> 5:4 already. Inpaint marble text at [985:1030, 20:130]
    # and patch sparkle at [1070:1115, 1350:1395]
    res = img.copy()
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    mask[985:1030, 20:130] = 255
    res = cv2.inpaint(res, mask, inpaintRadius=5, flags=cv2.INPAINT_TELEA)
    # Sparkle patch from adjacent dark tile
    sparkle_patch = res[1015:1060, 1350:1395]
    res[1070:1115, 1350:1395] = sparkle_patch
    return res

def recipe_24(img):
    # (1122, 1402) -> crop y: 250..1147 (1122x897, 5:4)
    return img[250:1147, :]

def recipe_25(img):
    # (1122, 1402) -> crop y: 250..1147 (1122x897, 5:4)
    return img[250:1147, :]

def recipe_26(img):
    # (1195, 896) -> crop x: 37..1157 (1120x896, 5:4)
    return img[:, 37:1157]

def recipe_27(img):
    # (1195, 896) -> inpaint ceiling text [10:55, 360:780]
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    mask[10:55, 360:780] = 255
    res = cv2.inpaint(img, mask, inpaintRadius=5, flags=cv2.INPAINT_TELEA)
    # Crop x: 0..1120 (excludes sparkle)
    return res[:, 0:1120]

def recipe_28(img):
    # (1195, 896) -> crop x: 0..1120 (excludes sparkle)
    return img[:, 0:1120]

def recipe_29(img):
    # (1543, 1019) -> crop x: 134..1407 (1273x1019, 5:4)
    return img[:, 134:1407]

IMAGE_MAP = [
    ("1.jpeg", "gallery-01.webp", recipe_1),
    ("2.jpeg", "gallery-02.webp", recipe_2),
    ("3.jpeg", "gallery-03.webp", recipe_3),
    ("4.jpeg", "gallery-04.webp", recipe_4),
    ("5.jpeg", "gallery-05.webp", recipe_5),
    ("6.jpeg", "gallery-06.webp", recipe_6),
    ("7.jpeg", "gallery-07.webp", recipe_7),
    ("8.jpeg", "gallery-08.webp", recipe_8),
    ("9.jpeg", "gallery-09.webp", recipe_9),
    ("10.jpeg", "gallery-10.webp", recipe_10),
    ("11.jpeg", "gallery-11.webp", recipe_11),
    ("12 BLUE ROMA.jpeg", "gallery-12.webp", recipe_12),
    ("13.jpeg", "gallery-13.webp", recipe_13),
    ("14.jpeg", "gallery-14.webp", recipe_14),
    ("15.jpeg", "gallery-15.webp", recipe_15),
    ("16.jpeg", "gallery-16.webp", recipe_16),
    ("17.jpeg", "gallery-17.webp", recipe_17),
    ("18.jpeg", "gallery-18.webp", recipe_18),
    ("19.jpeg", "gallery-19.webp", recipe_19),
    ("20.jpeg", "gallery-20.webp", recipe_20),
    ("21.jpeg", "gallery-21.webp", recipe_21),
    ("22.jpeg", "gallery-22.webp", recipe_22),
    ("23.jpeg", "gallery-23.webp", recipe_23),
    ("24.jpeg", "gallery-24.webp", recipe_24),
    ("25.jpeg", "gallery-25.webp", recipe_25),
    ("26 - FLORESTA VERDE1.jpeg", "gallery-26.webp", recipe_26),
    ("27 - FLORESTA VERDE2.jpeg", "gallery-27.webp", recipe_27),
    ("28 - Mid Night Gold Vein1.jpeg", "gallery-28.webp", recipe_28),
    ("29 - Mid Night Gold Vein2.jpeg", "gallery-29.webp", recipe_29),
]

def main():
    print(f"Processing {len(IMAGE_MAP)} gallery images to {OUTPUT_DIR}...")
    for idx, (src_name, out_name, recipe) in enumerate(IMAGE_MAP, 1):
        out_path = os.path.join(OUTPUT_DIR, out_name)
        processed = process_image(src_name, recipe)
        # Save as high quality WebP
        success = cv2.imwrite(out_path, processed, [cv2.IMWRITE_WEBP_QUALITY, 92])
        if not success:
            raise RuntimeError(f"Failed to write {out_path}")
        print(f"[{idx:02d}/29] Processed {src_name} -> {out_name} (1500x1200 WebP)")
    print("ALL 29 GALLERY IMAGES PROCESSED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
