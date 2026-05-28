import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropComponent } from '../../../components/DropDown';

@Component({
  selector: 'app-records-section',
  standalone: true,
  imports: [CommonModule, DropComponent],
  template: `
    <div class="flex justify-between items-center mb-5 flex-wrap gap-4">
      <div class="flex items-center gap-2">
        <h2 class="text-base font-bold text-slate-800 uppercase tracking-wider">
          All Records
        </h2>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <i class="ti ti-filter text-sm text-slate-400"></i>

          <app-drop
            [options]="userFilterOptions"
            [value]="filterUserId"
            placeholder="All Users"
            triggerWidth="w-44"
            dropWidth="w-52"
            (valueChange)="filterChange.emit($event)"
          >
          </app-drop>
        </div>

        <button
          (click)="addRecord.emit()"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 border border-transparent bg-slate-900 text-white shadow-sm hover:bg-slate-800 active:scale-[0.98]"
        >
          Add Record
        </button>
      </div>
    </div>

    <div
      class="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm"
    >
      <div
        class="px-6 py-[18px] bg-slate-50/50 border-b border-slate-200/60 flex justify-between items-center gap-3 flex-wrap"
      >
        <span class="font-bold text-sm text-slate-800 uppercase tracking-wider">
          Records Overview
        </span>

        <span
          class="text-xs bg-slate-200/60 px-2.5 py-1 rounded text-slate-600 font-semibold tracking-tight"
        >
          {{ filteredRecords.length }} ITEMS
        </span>
      </div>

      <div
        class="flex items-center justify-center gap-3 py-12 text-sm text-slate-400"
        *ngIf="recordsLoading"
      >
        <div
          class="w-5 h-5 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"
        ></div>

        Loading records...
      </div>

      <div class="overflow-x-auto" *ngIf="!recordsLoading">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/50">
              <th
                class="text-left px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider"
              >
                Assigned To
              </th>

              <th
                class="text-left px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider"
              >
                Title / Category
              </th>

              <th
                class="text-left px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                Status
              </th>

              <th
                class="text-left px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                Priority
              </th>

              <th
                class="text-left px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider"
              >
                Progress
              </th>

              <th
                class="text-left px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                Due Date
              </th>

              <th
                class="text-left px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              *ngFor="let r of filteredRecords"
              class="border-b border-slate-100/70 hover:bg-slate-50/50 transition-colors"
            >
              <td class="px-4 py-3.5 align-middle">
                <div class="flex items-center gap-2.5">
                  <div
                    class="w-7 h-7 rounded-lg bg-indigo-100 text-[10px] font-bold flex items-center justify-center flex-shrink-0"
                  >
                    {{ getInitials(r.assignedTo) }}
                  </div>

                  <span class="text-sm font-medium text-slate-800">
                    {{ getAssignedName(r.assignedTo) }}
                  </span>
                </div>
              </td>

              <td class="px-4 py-3.5 align-middle">
                <div class="text-sm font-semibold text-slate-800">
                  {{ r.title }}
                </div>

                <div class="text-[10px] text-slate-400 font-medium mt-0.5">
                  {{ r.category }}
                </div>
              </td>

              <td class="px-4 py-3.5 align-middle whitespace-nowrap">
                <span
                  class="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider min-w-[65px] text-center"
                  [ngClass]="{
                    'bg-emerald-50 border border-emerald-200/50':
                      r.status.toLowerCase() === 'active' ||
                      r.status.toLowerCase() === 'completed',

                    'bg-amber-50 border border-amber-200/50':
                      r.status.toLowerCase() === 'pending',

                    'bg-slate-100 text-slate-500 border border-slate-200/60':
                      r.status.toLowerCase() === 'archived',

                    'bg-indigo-50 border border-indigo-200/50':
                      r.status.toLowerCase() === 'inprogress'
                  }"
                >
                  {{ r.status }}
                </span>
              </td>

              <td class="px-4 py-3.5 align-middle whitespace-nowrap">
                <span
                  class="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider min-w-[65px] text-center"
                  [ngClass]="{
                    'bg-red-50 border border-red-100':
                      r.priority.toLowerCase() === 'high',

                    'bg-amber-50 border border-amber-200/50':
                      r.priority.toLowerCase() === 'medium',

                    'bg-emerald-50 border border-emerald-200/40':
                      r.priority.toLowerCase() === 'low',

                    'bg-slate-800 text-white':
                      r.priority.toLowerCase() === 'critical'
                  }"
                >
                  <i class="ti ti-flag text-[9px] mr-1"></i>

                  {{ r.priority }}
                </span>
              </td>

              <td class="px-4 py-3.5 align-middle">
                <div class="flex items-center gap-3">
                  <div
                    class="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/30"
                  >
                    <div
                      class="h-1.5 rounded-full transition-all duration-500 ease-out"
                      [style.width.%]="r.progress"
                      [style.background]="
                        getProgressColor(r.progress, r.status)
                      "
                    ></div>
                  </div>

                  <span
                    class="text-[11px] font-bold text-slate-500 tabular-nums"
                  >
                    {{ r.progress }}%
                  </span>
                </div>
              </td>

              <td
                class="px-4 py-3.5 align-middle whitespace-nowrap text-[12.5px] font-medium text-slate-600"
              >
                <span
                  [ngClass]="
                    isOverdue(r.dueDate)
                      ? 'bg-orange-50 px-2 py-0.5 rounded border border-orange-100 font-semibold'
                      : ''
                  "
                >
                  {{ r.dueDate | date : 'd MMM yyyy' }}
                </span>
              </td>

              <td class="px-4 py-3.5 align-middle whitespace-nowrap">
                <button
                  (click)="deleteRecord.emit(r._id)"
                  class="w-7 h-7 rounded-md border border-slate-200 bg-white cursor-pointer inline-flex items-center justify-center transition-all duration-200 hover:border-red-200 hover:bg-red-50"
                >
                  <img src="/delete.svg" alt="Delete" class="w-4 h-4" />
                </button>
              </td>
            </tr>

            <tr *ngIf="filteredRecords.length === 0 && !recordsLoading">
              <td colspan="7" class="text-center py-12 text-slate-400 text-sm">
                <i
                  class="ti ti-database-off text-3xl mb-2 block opacity-50"
                ></i>

                No records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class RecordsSectionComponent {
  @Input() filteredRecords: any[] = [];
  @Input() recordsLoading = false;

  @Input() userFilterOptions: any[] = [];
  @Input() filterUserId: string | null = null;

  @Input() getAssignedName!: (assignedTo: any) => string;
  @Input() getInitials!: (value: any) => string;
  @Input() getProgressColor!: (progress: number, status: string) => string;
  @Input() isOverdue!: (dueDate: string) => boolean;

  @Output() filterChange = new EventEmitter<string | null>();
  @Output() addRecord = new EventEmitter<void>();
  @Output() deleteRecord = new EventEmitter<string>();
  @Input() statusOptions: any[] = [];
  @Input() priorityOptions: any[] = [];
  @Input() categoryOptions: any[] = [];
}