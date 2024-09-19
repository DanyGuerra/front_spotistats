import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  showError(summary: string, detail: string): void {
    this.messageService.add({ severity: 'error', summary, detail });
  }

  showSuccess(summary: string, detail: string): void {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  showInfo(summary: string, detail: string): void {
    this.messageService.add({ severity: 'info', summary, detail });
  }

  showWarning(summary: string, detail: string): void {
    this.messageService.add({ severity: 'warn', summary, detail });
  }
}
