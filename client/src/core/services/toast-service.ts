import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  private router = inject(Router);

  private Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',        
    showConfirmButton: false,   
    timer: 5000,                
    timerProgressBar: true,     
  });

  
  private fireToast(icon: 'success' | 'error' | 'warning' | 'info', message: string, timer?: number, imageUrl?: string, redirectUrl?: string) {
    this.Toast.fire({
      icon: icon,
      title: message,
      showCloseButton: true,
      timer: timer ?? 5000,
      ...(imageUrl && {
        imageUrl: imageUrl,
        imageWidth: 40,
        imageHeight: 40,
        imageAlt: 'avatar',
      }),
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);

        if (redirectUrl) {
          toast.style.cursor = 'pointer';
          toast.addEventListener('click', () => {
            Swal.close();
            this.router.navigateByUrl(redirectUrl);
          });
        }
      }
    });
  }

  success(message: string, timer?: number, imageUrl?: string, redirectUrl?: string) {
    this.fireToast('success', message, timer, imageUrl, redirectUrl);
  }

  error(message: string, timer?: number, imageUrl?: string, redirectUrl?: string) {
    this.fireToast('error', message, timer, imageUrl, redirectUrl);
  }

  warning(message: string, timer?: number, imageUrl?: string, redirectUrl?: string) {
    this.fireToast('warning', message, timer, imageUrl, redirectUrl);
  }

  info(message: string, timer?: number, imageUrl?: string, redirectUrl?: string) {
    this.fireToast('info', message, timer, imageUrl, redirectUrl);
  }

  
}