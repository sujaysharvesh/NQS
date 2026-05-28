import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      <div class="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div class="text-[32px] font-bold text-slate-900 tracking-tight leading-none">
          {{ totalUsers || 0 }}
        </div>

        <div class="text-xs font-semibold uppercase tracking-wider mt-2.5 text-slate-500">
          Total Users
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div class="text-[32px] font-bold tracking-tight leading-none">
          {{ activeUsers || 0 }}
        </div>

        <div class="text-xs font-semibold uppercase tracking-wider mt-2.5 text-slate-500">
          Active Users
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div class="text-[32px] font-bold tracking-tight leading-none">
          {{ adminCount || 0 }}
        </div>

        <div class="text-xs font-semibold uppercase tracking-wider mt-2.5 text-slate-500">
          Admin
        </div>

      </div>

      <div class="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
        <div class="text-[32px] font-bold tracking-tight leading-none">
          {{ totalRecords || 0 }}
        </div>

        <div class="text-xs font-semibold uppercase tracking-wider mt-2.5 text-slate-500">
          Total Records
        </div>
      </div>

    </div>
  `,
})
export class AdminStatsComponent {
  @Input() totalUsers = 0;
  @Input() activeUsers = 0;
  @Input() adminCount = 0;
  @Input() totalRecords = 0;
}