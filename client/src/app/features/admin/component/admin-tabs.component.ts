import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-1 mb-8 bg-white rounded-xl border border-slate-200/60 p-1 w-fit shadow-sm">

      <button
        (click)="tabChange.emit('users')"
        class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
        [class]="activeTab === 'users'
          ? 'bg-slate-900 text-white shadow-sm'
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'">

        <i class="ti ti-users text-base"></i>
        User Management
      </button>

      <button
        (click)="tabChange.emit('records')"
        class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
        [class]="activeTab === 'records'
          ? 'bg-slate-900 text-white shadow-sm'
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'">

        <i class="ti ti-table text-base"></i>
        All Records
      </button>

    </div>
  `,
})
export class AdminTabsComponent {
  @Input() activeTab = 'users';

  @Output() tabChange = new EventEmitter<string>();
}