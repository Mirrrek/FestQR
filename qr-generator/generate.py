import random
import shutil
import segno
import os

DIRNAME = "codes"


def main():
    shutil.rmtree(f"{DIRNAME}-png", ignore_errors=True)
    shutil.rmtree(f"{DIRNAME}-png-transparent", ignore_errors=True)
    shutil.rmtree(f"{DIRNAME}-svg", ignore_errors=True)
    shutil.rmtree(f"{DIRNAME}-svg-transparent", ignore_errors=True)

    os.makedirs(f"{DIRNAME}-png", exist_ok=True)
    os.makedirs(f"{DIRNAME}-png-transparent", exist_ok=True)
    os.makedirs(f"{DIRNAME}-svg", exist_ok=True)
    os.makedirs(f"{DIRNAME}-svg-transparent", exist_ok=True)

    codes = generateCodes(180)

    for i, code in enumerate(codes):
        qr = segno.make_qr(code, error="Q")

        qr.save(f"{DIRNAME}-png/{str(i).rjust(3, '0')}.png", scale=10, border=2, light='white')
        qr.save(f"{DIRNAME}-png-transparent/{str(i).rjust(3, '0')}.png", scale=10, border=2, light=None)
        qr.save(f"{DIRNAME}-svg/{str(i).rjust(3, '0')}.svg", scale=10, border=2, light='white')
        qr.save(f"{DIRNAME}-svg-transparent/{str(i).rjust(3, '0')}.svg", scale=10, border=2, light=None)

    with open(f"{DIRNAME}-png/_codes.txt", "w") as f:
        f.write("\n".join(codes))

    with open(f"{DIRNAME}-png-transparent/_codes.txt", "w") as f:
        f.write("\n".join(codes))

    with open(f"{DIRNAME}-svg/_codes.txt", "w") as f:
        f.write("\n".join(codes))

    with open(f"{DIRNAME}-svg-transparent/_codes.txt", "w") as f:
        f.write("\n".join(codes))


def generateCodes(count):
    codes = []
    for _ in range(count):
        code = generateCode()
        while code in codes:
            code = generateCode()
        codes.append(code)
    return codes


def generateCode():
    return "-".join(["".join(random.choices("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", k=4)) for _ in range(5)])


if __name__ == "__main__":
    main()
