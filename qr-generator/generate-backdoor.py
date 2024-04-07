import segno


def main():
    qr = segno.make_qr("PENIS-COCK-AND-BALLS<3", error="Q")
    qr.save(f"backdoor.png", scale=10, border=2, light="white")


if __name__ == "__main__":
    main()
