'use client'

import { useEffect, useState, useId } from 'react';
import QrScanner from 'qr-scanner';
import styles from '@/styles/page.module.css';

export default function Main() {
    const videoElementID = useId();
    const codeTrackerElementID = useId();
    const okPopupElementID = useId();
    const errorPopupElementID = useId();
    const errorPopupTextElementID = useId();

    const [reset, setReset] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        const videoElement = document.getElementById(videoElementID);
        const codeTrackerElement = document.getElementById(codeTrackerElementID);
        const okPopupElement = document.getElementById(okPopupElementID);
        const errorPopupElement = document.getElementById(errorPopupElementID);
        const errorPopupTextElement = document.getElementById(errorPopupTextElementID);

        if (videoElement === null || !(videoElement instanceof HTMLVideoElement)) {
            throw new Error('Video element not found');
        }

        if (codeTrackerElement === null || !(codeTrackerElement instanceof HTMLDivElement)) {
            throw new Error('Code tracker element not found');
        }

        if (okPopupElement === null || !(okPopupElement instanceof HTMLDivElement)) {
            throw new Error('OK popup element not found');
        }

        if (errorPopupElement === null || !(errorPopupElement instanceof HTMLDivElement)) {
            throw new Error('Error popup element not found');
        }

        if (errorPopupTextElement === null || !(errorPopupTextElement instanceof HTMLDivElement)) {
            throw new Error('Error popup text element not found');
        }

        const validQRs = [
            'KSIb-W1pw-pans-zynI-RbLa', '9Oa9-OSZe-yKzk-TLo8-2xIb', 'dpKF-g985-YLGZ-U5Cw-0VUh', 'OPXR-gXmK-mBiF-Nzjk-KqCj',
            'NLSM-zgXG-ilsF-2X4x-4ixY', 'nAcP-KKQN-xd4k-TOTV-U7yh', 'm6GW-mIN7-k1K6-moye-Vp15', 'I3is-2QtC-MRLg-sTTY-xRox',
            'Qfbp-L8i4-7G59-zx5y-I8DF', 'klHe-gJJn-6wUS-7cBJ-Ym59', 'V0UD-dNy5-eatF-p8jf-Xlb0', 'aa2z-CVvn-RiAY-Y6NO-fMAt',
            'RX8w-IVJv-XWLe-SeBq-K3z0', '91vU-YDbX-ub8p-dShq-qVcS', 'MfqQ-nRZv-iOQ1-PFAH-2wGA', 'tj4s-g6Qn-wMTL-juYX-wltf',
            'WZP2-qBkB-xt7J-fuaG-mQSr', 'wgAB-SWBM-pZHa-dWKq-ye4n', 'Zue7-5hn7-ewzR-Bl3T-ZHTM', 'zdha-Pr8x-QTmn-WtOq-jPjg',
            'lDEh-aGlO-6YHA-iwU8-cLPg', 'O84T-tsFf-ud9y-7LyU-z3WD', 'aWwl-B8Nd-pjPj-GJht-oueW', 'bWtk-xJ72-fVVN-a8Uh-7gtP',
            'QbE8-v4l2-voES-acA8-jFGK', 'QhpP-t1OY-fT3x-2IhI-cS10', 'FsAB-VTCM-G9Ym-blNK-hwx6', 'tTM7-e3a3-G9fM-mkhJ-WV0A',
            'H2hc-BGP8-XQr6-OppM-WHVb', '0hBy-7hVI-OKGX-pqjZ-vsE4', 'NpzQ-Etqg-IQjX-K7Lg-PiwZ', 'JmML-QpKf-NF8h-CbDU-pUv6',
            'Ixh4-shfa-DJiG-cTSj-OfKo', '5Lpw-m5cJ-REnw-9uv9-e4qD', 'bqbR-kev1-A9kE-SDi7-mCoM', 'Ul32-o2R0-jjG3-Z3kl-wn2k',
            'OtKl-orsh-SAhD-bfNL-DKF6', 'zxb0-EUgx-Go8E-TxXC-lcrx', 'rjco-QDxg-h69X-pHOS-HOqw', 'opFi-uSZp-QG2G-3r6w-t7Ep',
            'unPG-2avy-42k5-SPln-WVoO', 'nR0c-S3ub-UEIH-Kctl-JY2R', 'dZFw-jprR-pFWS-yiDD-X8xU', 'BQ7B-fj2f-Eeis-bZ3Z-y2ni',
            'GVYu-qgVa-Pplt-qVF2-Chpu', 'zYko-gHEx-Wwez-nXH5-yoBP', 'RAhf-5ViD-9UAm-DFPp-9zbw', 'lR3v-CX2Y-88h7-eOH1-EUeP',
            'UiLp-bSip-9cz0-FkVy-QwdW', '2MIF-htm5-xjHL-KgwF-AC86', 'fEjd-TwSp-jgu0-PGpq-6IMn', 'JgUA-w03l-MVRw-X6Xb-RK9f',
            'JXci-2SWw-RCvk-bTLL-Po7X', 'HkxX-VMSN-A3v4-1jlm-6DQb', 'ZajJ-B1Gy-bCHH-KQRk-sV8j', 'wbOH-g0Va-1ryo-GDrq-F1yI',
            'Gz0C-yaE7-nOIv-7WR2-7lSR', '60we-Ysx7-Ifit-v2d1-P9g2', 'bnxP-2GsD-FDm8-M9UU-rMZ5', 'CyaR-bySH-O3ye-ezDe-zzQk',
            'WXkQ-CcAr-Tmem-RaWI-jpOn', 'm1Gs-rkqF-6r7A-EEDQ-ZLaY', 'iREe-X66p-BdRW-t8mU-1nFH', '4eE7-vNHY-Hw1A-UopQ-E0GR',
            'nVBH-V1Yi-nweZ-AT7R-4kFQ', '5w7f-hJ0B-wRpU-vnVV-7W7y', 'pB9M-PDi1-RETg-pcUH-kKED', 'Ml0U-9u3f-u59a-BdYI-yU0M',
            'O5Zk-ozBp-Wfgc-ZwCh-HNUD', 'HgWW-u8zQ-SEqS-qH38-9sKH', 'iqjH-ApdM-6T6r-89sy-Mqgb', 'kPiF-aW2W-BeZD-0Gd2-BF0v',
            'ee4Z-r9dn-KvUk-gSqz-ByKr', '0M37-EqER-MTja-MMNp-XzZG', 'c2vi-OwY5-azYg-Yizr-rkMg', 'vLq0-X2at-dLYi-029e-1g1q',
            'VdFK-z3X7-5Vvn-x0Eg-kHor', 'NQO4-AD15-zDFT-hMVq-tfER', 'O1pR-8TeK-PLyc-V31P-E4Do', 'ain7-d24s-KkLR-KQBd-ZGvK',
            'CzwK-KBlu-E2r3-VteF-Wxk6', 'u17U-XziJ-ZKIL-QZut-qoa3', 'DlNd-2mIb-b6uf-G5Vc-xTIE', 'i9ZV-Qhji-hT8s-wA6q-iXaq',
            'aKjc-mtUS-4XPe-griR-3j5I', 'ZhLa-LjAn-aV4U-Px21-W3Iw', 'KzQI-X08a-TGqJ-XceT-6Zn0', 'm641-47LU-8Wbk-LznH-rtPU',
            'PFHC-xyFS-jvB7-ioO0-0kwi', 'jzzh-0ATH-wjTS-DQcP-3rZ3', 'gpFP-4RGo-f13H-w2bN-5QHE', 'iZcU-UQMW-2ivr-dihK-Xadz',
            'LCD6-iDXI-Vhgk-ZQ9S-CmDj', '01eg-WeZ4-XjK5-J6A5-p00Y', 'bw4C-SUmX-ZHyv-Sfbo-apsU', 'MqrA-SRe8-K69v-u6vJ-2uSB',
            'VIjb-SedF-bn53-9xDI-KN8n', '5tQT-E4Co-NC5L-vnWA-A5o6', 'y3ZN-vDKN-ULbs-Qace-Q56w', 'g7ai-02gu-BFLO-j8UT-jybo',
            'ZZJY-KDWI-nOXR-3nBo-r0QO', '67l7-9sEb-tC6T-QdQy-GQWi', 'rMSK-rZP6-STGV-aOiw-E4zi', 'WoMK-jFVM-wNwl-BRBg-PJre',
            'SxBY-tzdu-W53p-hDzw-Di1C', 'qu9q-W6Te-z5qy-wOol-kSCh', 'SHF9-cXJC-eact-C1sT-j0xl', 's9lH-zZA7-JAkR-hfUl-BIYM',
            'xo7X-VYfT-UvU8-MkiY-9i2q', 'nzuU-iWU0-e7Ix-1zCU-cgOp', 'ycsu-eSV2-XVqN-df0S-wMkD', 'Sfgb-a03W-6lTZ-zKhN-9AX6',
            'ldh3-ukUC-dnzV-08jA-muQB', '8rAn-kJnW-XkXv-S5LT-Tv4h', 'yyyF-2NVp-XFh8-kxIr-eTJL', 'hNEH-8qGE-AxO9-w6q4-2bGP',
            '49AL-921y-gwKr-qJKd-SGU9', 'IUIp-iEjH-xdda-kNnx-6JS7', 'Sctc-7lA9-9PZq-AxM5-AHVu', 'u7bQ-JkyU-e2l7-5k7x-mNbX',
            'FJmy-zI7K-Oraa-fKlT-1Vzx', 'isgs-Fk8P-QaKy-R8VD-oHF8', 'MY8B-0k42-qLSX-zc7O-quqa', 'OG9X-SGWf-TAm0-uHeI-W7Oa',
            'qt6W-xO5E-Zm2n-eyS3-0xL1', '9JE4-qN9E-7wKk-zQr9-ZJmC', 'uIB5-vIsI-7na7-XFDg-rZVf', 'et9D-TQu2-0qYk-PX6c-reTK',
            'miki-lCHN-fkkH-HXyJ-mYT7', '2Fo3-3pYl-nowJ-Flkf-JATd', '7vMX-U3eD-5O2f-GJ58-zsWl', 'iDpL-6Hsq-k6lq-EPoh-3xxh',
            'LBNF-mqWL-GAwE-PcrY-dH07', '68vV-v71B-jfLA-J72J-Gg9B', 'VckH-QphS-CNPL-AAQP-7GlJ', 'idK5-awdy-Ky27-wLV8-n10Q',
            'uVMO-cgGp-b9lY-Paac-Tk8V', 'ujvN-NI0J-mj1O-UW2Q-cPi1', 'bVJk-gumN-dsta-kQiS-eNnm', 'DqpU-F4ld-NHKH-Mgc5-PoF4',
            '95cs-U1iA-H3Z0-Qs44-mXmE', 'SBAI-8Qgp-Zc2y-LkDA-EtyY', 'qvEX-pa5h-rsYg-1ZeJ-lJEI', 'nf7r-Lh1R-h2cP-yGwg-cZpW',
            'RNIm-PkiM-XZe3-4sc7-Zp16', 'efSM-Bhd2-LJ2J-5V4c-Gb5d', 'DGP3-H2ll-XwJv-x4Bx-EAoq', 'vohK-4AcM-rgEW-EfCO-YbtF',
            'Y5om-RYvX-JNn7-2dUN-n19C', 'z3H9-FHXY-WJBI-yCVI-xR84', 'PnsB-aTbm-TayB-cA0f-lozh', 'balJ-TkKL-gpye-pj6M-GJcW',
            'U4Ke-6q1x-QFM5-E7dc-Estp', 'L8ki-segz-PR29-6AlZ-7PkM', 'XPYi-9Kdh-qoa5-dTUl-SJFG', '4jTz-q11z-hEGi-S2Cb-eBEd',
            'jMPz-f14q-LZpU-c2Et-c0b9', 'Amia-n4kC-moCA-XLN0-3L7R', 'ydUN-yx7x-fZnA-3xLE-UEKT', 'vlbp-8yHl-WU2U-MUHm-3oD1',
            'z1jz-QfS5-RVWh-6coj-PgAR', 'yUCQ-0kQV-MNJB-G7Ve-A2x4', '31Jw-AHgC-7eft-DZAX-H0dO', 'fb9P-kjkX-3nW8-CS6n-sXyl',
            'TjTV-eAOv-vCuT-8zha-ekUk', 'QXMI-A2He-q7Ud-ZPvv-j2uD', 'Tztx-IQn6-1N58-BNXz-GQMt', 'P1cS-WAq2-299K-WQbB-DjOJ',
            'T1MY-H2Cc-AgER-HFia-n5rL', 'xT5a-dkMs-mUIr-gIqV-CBc9', 'GWnT-E5uJ-J27v-RGfH-rNfQ', 'h6yA-qpuE-gEMT-83mZ-azVU',
            'vSss-0Q3c-IGEE-lOz4-yCwE', 'XfND-7gox-AQzZ-2vgS-gklS', 'UqJf-BvHT-pAqB-m9bp-gGcO', 'vdV2-zNC7-x6fw-iYxt-IVxp',
            'Z2pt-3Hmp-WQgS-b1l2-qvOs', 'R6C7-BrWp-CBnU-nrrD-2THV', 'uI9N-8sk1-u6Rm-cPfc-IFwG', 'Vt77-yxmx-m7tn-4aRU-Dxyw',
        ]

        const backdoorQR = 'PENIS-COCK-AND-BALLS<3';

        const scannedQRs: { value: string, timestamp: number }[] = JSON.parse(localStorage.getItem('scannedQRs') ?? '[]');
        let currentQR: string | null = null;
        let activeTimeout = setTimeout(() => { }, 0);

        const scanner = new QrScanner(videoElement, (result) => {
            if (currentQR === result.data) {
                codeTrackerElement.style.opacity = '1';
                const transformMatrix = `matrix3d(${generateTransformMatrix([{
                    x: result.cornerPoints[0].x - 25,
                    y: result.cornerPoints[0].y - 25
                }, {
                    x: result.cornerPoints[1].x + 25,
                    y: result.cornerPoints[1].y - 25
                }, {
                    x: result.cornerPoints[3].x - 25,
                    y: result.cornerPoints[3].y + 25
                }, {
                    x: result.cornerPoints[2].x + 25,
                    y: result.cornerPoints[2].y + 25
                }], videoElement.style.transform.includes('scaleX(-1)'))}`;
                codeTrackerElement.style.transform = transformMatrix;
                codeTrackerElement.style.webkitTransform = transformMatrix;

                clearTimeout(activeTimeout);
                activeTimeout = setTimeout(() => {
                    currentQR = null;
                    codeTrackerElement.style.opacity = '0';
                    errorPopupElement.style.opacity = '0';
                    errorPopupElement.style.pointerEvents = 'none';
                    okPopupElement.style.opacity = '0';
                    okPopupElement.style.pointerEvents = 'none';
                }, 1000);
            }

            if (currentQR !== null) {
                return;
            }

            currentQR = result.data;

            activeTimeout = setTimeout(() => {
                currentQR = null;
                codeTrackerElement.style.opacity = '0';
                errorPopupElement.style.opacity = '0';
                errorPopupElement.style.pointerEvents = 'none';
                okPopupElement.style.opacity = '0';
                okPopupElement.style.pointerEvents = 'none';
            }, 1000);

            if (result.data === backdoorQR) {
                okPopupElement.style.opacity = '1';
                okPopupElement.style.pointerEvents = 'auto';
            } else if (!/^[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}$/.test(result.data) || !validQRs.includes(result.data)) {
                errorPopupTextElement.textContent = 'Invalid code';
                errorPopupElement.style.opacity = '1';
                errorPopupElement.style.pointerEvents = 'auto';
            } else if (scannedQRs.some((scannedQR) => scannedQR.value === result.data)) {
                const difference = Date.now() - scannedQRs.find((scannedQR) => scannedQR.value === result.data)!.timestamp;
                errorPopupTextElement.textContent = `Scanned ${difference > 60 * 60 * 1000 ? `${Math.round(difference / 60 / 60 / 1000)}h` : difference > 60 * 1000 ? `${Math.round(difference / 60 / 1000)}min` : `${Math.round(difference / 1000)}s`} ago`;
                errorPopupElement.style.opacity = '1';
                errorPopupElement.style.pointerEvents = 'auto';
            } else {
                scannedQRs.push({
                    value: result.data,
                    timestamp: Date.now()
                });
                localStorage.setItem('scannedQRs', JSON.stringify(scannedQRs));

                okPopupElement.style.opacity = '1';
                okPopupElement.style.pointerEvents = 'auto';
            }
        }, {
            calculateScanRegion: (videoElement) => {
                if (videoElement.videoWidth / videoElement.videoHeight > videoElement.offsetWidth / videoElement.offsetHeight) {
                    const scale = videoElement.videoHeight / videoElement.offsetHeight;
                    return {
                        x: Math.floor((videoElement.videoWidth - videoElement.offsetWidth * scale) / 2),
                        y: 0,
                        width: Math.floor(videoElement.offsetWidth * scale),
                        height: videoElement.videoHeight,
                        downScaledWidth: 512,
                        downScaledHeight: Math.floor(512 / videoElement.offsetWidth * videoElement.offsetHeight)
                    }
                } else {
                    const scale = videoElement.videoWidth / videoElement.offsetWidth;
                    return {
                        x: 0,
                        y: Math.floor((videoElement.videoHeight - videoElement.offsetHeight * scale) / 2),
                        width: videoElement.videoWidth,
                        height: Math.floor(videoElement.offsetHeight * scale),
                        downScaledWidth: Math.floor(512 / videoElement.offsetHeight * videoElement.offsetWidth),
                        downScaledHeight: 512
                    }
                }
            },
            onDecodeError: (error) => {
                if (error !== QrScanner.NO_QR_CODE_FOUND && error !== `Scanner error: ${QrScanner.NO_QR_CODE_FOUND}`) {
                    alert(`An error occurred while decoding the QR code.\n\n${typeof error === 'string' ? error : `${error.name}: ${error.message}`}`);
                }
            }
        });

        function generateTransformMatrix(cornerPoints: [{ x: number, y: number }, { x: number, y: number }, { x: number, y: number }, { x: number, y: number }], invertX = false) {
            if (videoElement === null || !(videoElement instanceof HTMLVideoElement)) {
                return '1,0,0,0,1,0,0,0,1';
            }

            if (codeTrackerElement === null || !(codeTrackerElement instanceof HTMLDivElement)) {
                return '1,0,0,0,1,0,0,0,1';
            }

            if (videoElement.videoWidth / videoElement.videoHeight > videoElement.offsetWidth / videoElement.offsetHeight) {
                const scale = videoElement.offsetHeight / videoElement.videoHeight;
                cornerPoints = cornerPoints.map((p) => ({
                    x: (p.x - (videoElement.videoWidth - videoElement.offsetWidth / scale) / 2) * scale,
                    y: p.y * scale
                })) as [{ x: number, y: number }, { x: number, y: number }, { x: number, y: number }, { x: number, y: number }];
            } else {
                const scale = videoElement.offsetWidth / videoElement.videoWidth;
                cornerPoints = cornerPoints.map((p) => ({
                    x: p.x * scale,
                    y: (p.y - (videoElement.videoHeight - videoElement.offsetHeight / scale) / 2) * scale
                })) as [{ x: number, y: number }, { x: number, y: number }, { x: number, y: number }, { x: number, y: number }];
            }

            if (invertX) {
                cornerPoints = cornerPoints.map((p) => ({ x: videoElement.offsetWidth - p.x, y: p.y })) as [{ x: number, y: number }, { x: number, y: number }, { x: number, y: number }, { x: number, y: number }];
            }

            function multiply9x9(a: [number, number, number, number, number, number, number, number, number],
                b: [number, number, number, number, number, number, number, number, number]):
                [number, number, number, number, number, number, number, number, number] {
                return [
                    a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
                    a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
                    a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
                    a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
                    a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
                    a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
                    a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
                    a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
                    a[6] * b[2] + a[7] * b[5] + a[8] * b[8]
                ]
            }

            function multiply9x3(m: [number, number, number, number, number, number, number, number, number],
                v: [number, number, number]): [number, number, number] {
                return [
                    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
                    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
                    m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
                ]
            }

            function adjugate(m: [number, number, number, number, number, number, number, number, number]):
                [number, number, number, number, number, number, number, number, number] {
                return [
                    m[4] * m[8] - m[5] * m[7],
                    m[2] * m[7] - m[1] * m[8],
                    m[1] * m[5] - m[2] * m[4],
                    m[5] * m[6] - m[3] * m[8],
                    m[0] * m[8] - m[2] * m[6],
                    m[2] * m[3] - m[0] * m[5],
                    m[3] * m[7] - m[4] * m[6],
                    m[1] * m[6] - m[0] * m[7],
                    m[0] * m[4] - m[1] * m[3]
                ]
            }

            function basisToPoints(p1: { x: number, y: number }, p2: { x: number, y: number }, p3: { x: number, y: number }, p4: { x: number, y: number }):
                [number, number, number, number, number, number, number, number, number] {
                const m: [number, number, number, number, number, number, number, number, number] = [
                    p1.x, p2.x, p3.x,
                    p1.y, p2.y, p3.y,
                    1, 1, 1
                ]
                const v = multiply9x3(adjugate(m), [p4.x, p4.y, 1]);
                return multiply9x9(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
            }

            const result = multiply9x9(
                basisToPoints(
                    cornerPoints[0],
                    cornerPoints[1],
                    cornerPoints[2],
                    cornerPoints[3]
                ),
                adjugate(
                    basisToPoints(
                        { x: 0, y: 0 },
                        { x: codeTrackerElement.offsetWidth, y: 0 },
                        { x: 0, y: codeTrackerElement.offsetHeight },
                        { x: codeTrackerElement.offsetWidth, y: codeTrackerElement.offsetHeight }
                    )
                )
            );

            return [result[0], result[3], 0, result[6], result[1], result[4], 0, result[7], 0, 0, 1, 0, result[2], result[5], 0, result[8]].join(',');
        }

        setTimeout(() => { scanner.start().catch(() => { }) }, 500);

        window.addEventListener('resize', () => {
            setTimeout(() => setReset(!reset), 100);
        });

        window.addEventListener('fullscreenchange', () => {
            setFullscreen(document.fullscreenElement !== null);
        });

        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason instanceof Error && event.reason.message === 'The play() request was interrupted by a new load request. https://goo.gl/LdLk22') {
                setReset(!reset);
            } else {
                alert(`An unexpected error occurred.\n\n${event.reason instanceof Error ? `${event.reason.name}: ${event.reason.message}` : event.reason}`);
            }
        });

        window.addEventListener('error', (event) => {
            alert(`An unexpected error occurred.\n\n${event.message}`);
        });

        return () => {
            scanner.destroy();
        }
    }, [videoElementID, codeTrackerElementID, okPopupElementID, errorPopupElementID, errorPopupTextElementID, reset]);

    return <main className={styles.main}>
        <div className={styles.controls}>
            <button className={styles.button} onClick={() => {
                if (fullscreen) {
                    document.exitFullscreen() ?? (document as any).webkitExitFullscreen();
                } else {
                    document.documentElement.requestFullscreen() ?? (document.documentElement as any).webkitRequestFullscreen();
                }
            }}><span className='material-symbols-outlined'>{fullscreen ? 'fullscreen_exit' : 'fullscreen'}</span></button>
            <button className={styles.button} onClick={() => setReset(!reset)}><span className='material-symbols-outlined'>replay</span></button>
            <button className={styles.button} onClick={() => {
                if (confirm('Clearing history will allow all previously scanned QRs to be scanned again. This action cannot be undone.\n\nAre you sure you want to clear scanned QR history?')) {
                    localStorage.removeItem('scannedQRs');
                    setReset(!reset);
                }
            }}><span className='material-symbols-outlined'>delete</span></button>
        </div>
        <div className={styles.videoContainer}>
            <video playsInline id={videoElementID} className={styles.video}></video>
            <div id={codeTrackerElementID} className={styles.codeTracker}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <g fill="#f0f0f0">
                        <path d="M0 30L0 60A7.5 7.5 0 0 0 15 60L15 30A15 15 0 0 1 30 15L60 15A7.5 7.5 0 0 0 60 0L30 0A30 30 0 0 0 0 30ZM200 170L200 140A7.5 7.5 0 0 0 185 140L185 170A15 15 0 0 1 170 185L140 185A7.5 7.5 0 0 0 140 200L170 200A30 30 0 0 0 200 170Z" />
                    </g>
                </svg>
            </div>
            <div id={okPopupElementID} className={styles.popup} style={{ opacity: 0 }}>
                <svg xmlns='http://www.w3.org/2000/svg' width={128} height={128} viewBox='0 0 64 64' className={styles.popupIcon}>
                    <circle cx='32' cy='32' r='30' fill='#43a047' />
                    <path d='M25.025,50l-0.02-0.02L24.988,50L11,35.6l7.029-7.164l6.977,7.184l21-21.619L53,21.199L25.025,50z' fill='#f0f0f0' />
                </svg>
            </div>
            <div id={errorPopupElementID} className={styles.popup} style={{ opacity: 0 }}>
                <svg xmlns='http://www.w3.org/2000/svg' width={128} height={128} viewBox='0 0 48 48' className={styles.popupIcon}>
                    <g transform='matrix(1 0 0 1-58.37.882)'>
                        <circle cx='82.37' cy='23.12' r='24' fill='#dd3333' />
                        <path d='m87.77 23.725l5.939-5.939c.377-.372.566-.835.566-1.373 0-.54-.189-.997-.566-1.374l-2.747-2.747c-.377-.372-.835-.564-1.373-.564-.539 0-.997.186-1.374.564l-5.939 5.939-5.939-5.939c-.377-.372-.835-.564-1.374-.564-.539 0-.997.186-1.374.564l-2.748 2.747c-.377.378-.566.835-.566 1.374 0 .54.188.997.566 1.373l5.939 5.939-5.939 5.94c-.377.372-.566.835-.566 1.373 0 .54.188.997.566 1.373l2.748 2.747c.377.378.835.564 1.374.564.539 0 .997-.186 1.374-.564l5.939-5.939 5.94 5.939c.377.378.835.564 1.374.564.539 0 .997-.186 1.373-.564l2.747-2.747c.377-.372.566-.835.566-1.373 0-.54-.188-.997-.566-1.373l-5.939-5.94' fill='#ffffff' />
                    </g>
                </svg>
                <div id={errorPopupTextElementID} className={styles.popupText}>Invalid QR</div>
            </div>
        </div>
    </main>
}
