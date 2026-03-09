import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  private Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',        
    showConfirmButton: false,   
    timer: 3000,                
    timerProgressBar: true,     
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  
  private fireToast(icon: 'success' | 'error' | 'warning' | 'info', message: string) {
    this.Toast.fire({
      icon: icon,
      title: message,
      showCloseButton: true,    
    }).then((result: SweetAlertResult) => {
      if (result.dismiss === Swal.DismissReason.close) {
        console.log('Toast zatvoren ručno');
      }
    });
  }

  success(message: string) {
    this.fireToast('success', message);
  }

  error(message: string) {
    this.fireToast('error', message);
  }

  warning(message: string) {
    this.fireToast('warning', message);
  }

  info(message: string) {
    this.fireToast('info', message);
  }
}