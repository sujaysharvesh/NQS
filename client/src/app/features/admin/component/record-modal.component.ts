import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DropComponent } from '../../../components/DropDown';

@Component({
  selector: 'app-record-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropComponent],
  template: `
    <div
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-5"
      *ngIf="showRecordModal"
      (click)="close.emit()"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-[520px] shadow-xl overflow-hidden"
        (click)="$event.stopPropagation()"
      >
        <div class="flex justify-between items-center px-6 pt-5 pb-4 border-b border-slate-100">
          <h3 class="text-base font-bold text-slate-800 uppercase tracking-wider">Add New Record</h3>

          <button
            (click)="close.emit()"
            class="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-slate-100"
          >
            <img src="/x.svg" alt="Close" class="w-4 h-4" />
          </button>
        </div>

        <form [formGroup]="recordForm" (ngSubmit)="save.emit()" novalidate>
          <div class="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">

            <div>
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Assign To <span class="text-red-400">*</span>
              </label>

              <app-drop
                [options]="userFilterOptions.slice(1)"
                [value]="recordForm.get('assignedTo')?.value"
                placeholder="Select user"
                [inline]="true"
                (valueChange)="recordForm.get('assignedTo')?.setValue($event); recordForm.get('assignedTo')?.markAsTouched()"
              ></app-drop>

              <p
                *ngIf="rf['assignedTo'].invalid && rf['assignedTo'].touched"
                class="text-[11px] text-red-500 mt-1"
              >
                Please select a user.
              </p>
            </div>

            <div>
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Title <span class="text-red-400">*</span>
              </label>
              <input
                type="text"
                formControlName="title"
                placeholder="e.g. Frontend Dashboard Redesign"
                class="w-full px-3 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg outline-none transition-all duration-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                [class.border-red-300]="rf['title'].invalid && rf['title'].touched"
              />
            </div>

            <div>
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Description <span class="text-red-400">*</span>
              </label>
              <textarea
                formControlName="description"
                rows="2"
                placeholder="Brief description..."
                class="w-full px-3 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg outline-none transition-all duration-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 resize-none"
                [class.border-red-300]="rf['description'].invalid && rf['description'].touched"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Status <span class="text-red-400">*</span>
                </label>

                <app-drop
                  [options]="statusOptions"
                  [value]="recordForm.get('status')?.value"
                  placeholder="Select status"
                  [inline]="true"
                  (valueChange)="recordForm.get('status')?.setValue($event); recordForm.get('status')?.markAsTouched()"
                ></app-drop>
              </div>

              <div>
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Priority <span class="text-red-400">*</span>
                </label>

                <app-drop
                  [options]="priorityOptions"
                  [value]="recordForm.get('priority')?.value"
                  placeholder="Select priority"
                  [inline]="true"
                  (valueChange)="recordForm.get('priority')?.setValue($event); recordForm.get('priority')?.markAsTouched()"
                ></app-drop>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Category <span class="text-red-400">*</span>
                </label>

                <app-drop
                  [options]="categoryOptions"
                  [value]="recordForm.get('category')?.value"
                  placeholder="Select category"
                  [inline]="true"
                  (valueChange)="recordForm.get('category')?.setValue($event); recordForm.get('category')?.markAsTouched()"
                ></app-drop>
              </div>

              <div>
                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Due Date <span class="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  formControlName="dueDate"
                  class="w-full px-3 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg outline-none transition-all duration-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                  [class.border-red-300]="rf['dueDate'].invalid && rf['dueDate'].touched"
                />
              </div>
            </div>

            <div>
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Progress
                <span class="text-slate-400 normal-case font-medium">
                  ({{ recordForm.get('progress')?.value }}%)
                </span>
              </label>

              <input
                type="range"
                formControlName="progress"
                min="0"
                max="100"
                step="5"
                class="w-full accent-slate-900"
              />

              <div class="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0%</span><span>50%</span><span>100%</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <button
              type="button"
              (click)="close.emit()"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              [disabled]="recordModalLoading"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 border border-transparent bg-slate-900 text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <i class="ti" [ngClass]="recordModalLoading ? 'ti-loader-2 animate-spin' : 'ti-check'"></i>
              Create Record
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class RecordModalComponent {
  @Input() showRecordModal = false;
  @Input() recordForm!: FormGroup;
  @Input() recordModalLoading = false;

  @Input() userFilterOptions: { name: string; code: string | null }[] = [];
  @Input() statusOptions: { name: string; code: string }[] = [];
  @Input() priorityOptions: { name: string; code: string }[] = [];
  @Input() categoryOptions: { name: string; code: string }[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  get rf() {
    return this.recordForm.controls;
  }
}