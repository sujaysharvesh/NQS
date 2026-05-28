import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-record-confirm',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-5"
      *ngIf="showDeleteRecordConfirm"
      (click)="close.emit()">

      <div
        class="bg-white rounded-2xl w-full max-w-[400px] shadow-xl overflow-hidden"
        (click)="$event.stopPropagation()">

        <div class="px-6 pt-6 pb-5 text-center">
          <p class="text-sm text-slate-500">
            Are you sure you want to delete
            <strong class="text-slate-800">
              {{ recordToDelete?.title }}
            </strong>?
            This action cannot be undone.
          </p>
        </div>

        <div class="flex justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/50">

          <button
            type="button"
            (click)="close.emit()"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50">

            Cancel
          </button>

          <button
            type="button"
            (click)="confirm.emit()"
            [disabled]="recordModalLoading"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 border border-transparent bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">

            <i class="ti ti-trash"></i>
            Delete Record
          </button>

        </div>
      </div>
    </div>
  `,
})
export class DeleteRecordConfirmComponent {
  @Input() showDeleteRecordConfirm = false;

  @Input() recordToDelete: {
    _id: string;
    title: string;
  } | null = null;

  @Input() recordModalLoading = false;

  @Output() close = new EventEmitter<void>();

  @Output() confirm = new EventEmitter<void>();
}