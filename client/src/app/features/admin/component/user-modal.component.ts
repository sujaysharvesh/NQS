import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DropComponent } from '../../../components/DropDown';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropComponent],
  template: `
    <div
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-5"
      *ngIf="showModal"
      (click)="close.emit()"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-[480px] shadow-xl overflow-hidden"
        (click)="$event.stopPropagation()"
      >
        <div class="flex justify-between items-center px-6 pt-5 pb-4 border-b border-slate-100">
          <h3 class="text-base font-bold text-slate-800 uppercase tracking-wider">
            {{ editingUser ? 'Edit User' : 'Add New User' }}
          </h3>

          <button
            (click)="close.emit()"
            class="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-slate-100"
          >
            <img src="/x.svg" alt="Close" class="w-4 h-4" />
          </button>
        </div>

        <form [formGroup]="userForm" (ngSubmit)="save.emit()" novalidate>
          <div class="px-6 py-5 space-y-4">

            <div>
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                formControlName="name"
                placeholder="e.g. John Doe"
                class="w-full px-3 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg outline-none transition-all duration-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                [class.border-red-300]="mf['name'].invalid && mf['name'].touched"
              />
            </div>

            <div>
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                formControlName="email"
                placeholder="user@example.com"
                class="w-full px-3 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg outline-none transition-all duration-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                [class.border-red-300]="mf['email'].invalid && mf['email'].touched"
              />
            </div>

            <div *ngIf="!editingUser">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Password
              </label>
              <input
                type="password"
                formControlName="password"
                placeholder="Minimum 4 characters"
                class="w-full px-3 py-2.5 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg outline-none transition-all duration-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
                [class.border-red-300]="mf['password'].invalid && mf['password'].touched"
              />
            </div>

            <div *ngIf="!editingUser">
              <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Role
              </label>
              <app-drop
                [options]="roleOptions"
                [value]="userForm.get('role')?.value"
                placeholder="Select role"
                [inline]="true"
                (valueChange)="userForm.get('role')?.setValue($event); userForm.get('role')?.markAsTouched()"
              >
              </app-drop>
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
              [disabled]="modalLoading"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 border border-transparent bg-slate-900 text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <i class="ti" [ngClass]="modalLoading ? 'ti-loader-2 animate-spin' : 'ti-check'"></i>
              {{ editingUser ? 'Save Changes' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class UserModalComponent {
  @Input() showModal = false;
  @Input() editingUser: any = null;
  @Input() userForm!: FormGroup;
  @Input() modalLoading = false;
  @Input() roleOptions: { name: string; code: string }[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  get mf() {
    return this.userForm.controls;
  }
}