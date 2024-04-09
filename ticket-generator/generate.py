from PIL import Image
import math
import os

# On-page sizing
QR_SIZE = 336
X_OFFSET = 870
Y_OFFSET = 213
X_COEFFICIENT = 1240
Y_COEFFICIENT = 585
QRS_PER_PAGE_WIDTH = 2
QRS_PER_PAGE_HEIGHT = 6
QRS_PER_PAGE = QRS_PER_PAGE_WIDTH * QRS_PER_PAGE_HEIGHT

# Paths
CLEAR_PAGE_IMAGE = "clearPage.png"
QR_FOLDER_PATH = "codes-png"
OUTPUT_FOLDER_PATH = "pages"


def main():
    clearPageImage = Image.open(CLEAR_PAGE_IMAGE)
    qrPaths = [i for i in os.listdir(QR_FOLDER_PATH) if i.endswith(".png")]
    qrPaths = [qrPaths[i * QRS_PER_PAGE : (i + 1) * QRS_PER_PAGE] for i in range(math.ceil(clearPageImage.width / QRS_PER_PAGE))]
    qrPaths = [qrPaths[i] for i in range(len(qrPaths)) if i < math.ceil(clearPageImage.width / QRS_PER_PAGE)]
    print(qrPaths)
    pageIndex = 0
    for qrPaths in qrPaths:
        pageImage = clearPageImage.copy()
        for i, qrPath in enumerate(qrPaths):
            qrImage = Image.open(os.path.join(QR_FOLDER_PATH, qrPath))
            x = i % QRS_PER_PAGE_WIDTH
            y = i // QRS_PER_PAGE_WIDTH
            qrImage = qrImage.resize((QR_SIZE, QR_SIZE))
            pageImage.paste(qrImage, (X_OFFSET + x * X_COEFFICIENT, (Y_OFFSET + y * Y_COEFFICIENT)), qrImage)
        pageImage.save(os.path.join(OUTPUT_FOLDER_PATH, f"page-{str(pageIndex).rjust(3, '0')}.png"))
        pageIndex += 1
        
if __name__ == "__main__":
    main()
