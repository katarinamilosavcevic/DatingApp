import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
});

function fireToast(icon: 'success' | 'error' | 'warning' | 'info', message: string, timer?: number, imageUrl?: string, redirectUrl?: string) {
    Toast.fire({
        icon,
        title: message,
        showCloseButton: true,
        timer: timer ?? 5000,
        ...(imageUrl && { imageUrl, imageWidth: 40, imageHeight: 40, imageAlt: 'avatar', }),
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
            if (redirectUrl) {
                toast.style.cursor = 'pointer';
                toast.addEventListener('click', () => {
                    Swal.close();
                    window.location.href = redirectUrl;
                });
            }
        },
    });
}

export const toast = {
    success: (message: string, timer?: number, imageUrl?: string, redirectUrl?: string) => fireToast('success', message, timer, imageUrl, redirectUrl),
    error: (message: string, timer?: number, imageUrl?: string, redirectUrl?: string) => fireToast('error', message, timer, imageUrl, redirectUrl),
    warning: (message: string, timer?: number, imageUrl?: string, redirectUrl?: string) => fireToast('warning', message, timer, imageUrl, redirectUrl),
    info: (message: string, timer?: number, imageUrl?: string, redirectUrl?: string) => fireToast('info', message, timer, imageUrl, redirectUrl),
};