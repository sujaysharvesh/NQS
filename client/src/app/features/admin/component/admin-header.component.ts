import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-16 bg-white border-b rounded-3xl border-slate-200/80 flex items-center justify-between px-8 flex-shrink-0">
      <div class="text-sm font-medium text-slate-500 tracking-wide">
        Dashboard /
        <span class="text-slate-900 font-semibold">Admin Panel</span>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-2xl border border-slate-200/60">
          <span class="text-[13px] font-semibold text-slate-700 tracking-tight">
            {{ user?.name }}
          </span>
        </div>
      </div>
    </div>
  `,
})
export class AdminHeaderComponent {
  @Input() user: any;
}