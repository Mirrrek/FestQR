'use client'

import { useEffect, useState, useId } from 'react';
import QrScanner from 'qr-scanner';
import styles from '@/styles/page.module.css';

export default function Main() {
    const videoElementID = useId();
    const okPopupElementID = useId();
    const errorPopupElementID = useId();
    const errorPopupTextElementID = useId();

    const [reset, setReset] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        const videoElement = document.getElementById(videoElementID);
        const okPopupElement = document.getElementById(okPopupElementID);
        const errorPopupElement = document.getElementById(errorPopupElementID);
        const errorPopupTextElement = document.getElementById(errorPopupTextElementID);

        if (videoElement === null || !(videoElement instanceof HTMLVideoElement)) {
            throw new Error('Video element not found');
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

        const validQRs = ['TEST-TEXT-ABCD-1234-5678', '5678-1234-5678-1234-5678', '1234-5678-1234-5678-5678', '5678-1234-5678-1234-1234'];
        const scannedQRs: { value: string, timestamp: number }[] = JSON.parse(localStorage.getItem('scannedQRs') ?? '[]');
        let currentQR: string | null = null;
        let activeTimeout = setTimeout(() => { }, 0);

        const scanner = new QrScanner(videoElement, (result) => {
            if (currentQR === result.data) {
                clearTimeout(activeTimeout);
                activeTimeout = setTimeout(() => {
                    currentQR = null;
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
                errorPopupElement.style.opacity = '0';
                errorPopupElement.style.pointerEvents = 'none';
                okPopupElement.style.opacity = '0';
                okPopupElement.style.pointerEvents = 'none';
            }, 1000);

            if (!/^[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}$/.test(result.data) || !validQRs.includes(result.data)) {
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

        setTimeout(() => { scanner.start().catch(() => { }) }, 500);

        window.addEventListener('resize', () => {
            setTimeout(() => setReset(!reset), 100);
        });

        window.addEventListener('fullscreenchange', () => {
            setFullscreen(document.fullscreenElement !== null);
        });

        return () => {
            scanner.destroy();
        }
    }, [videoElementID, okPopupElementID, errorPopupElementID, errorPopupTextElementID, reset]);

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
