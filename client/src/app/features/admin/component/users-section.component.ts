import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-between items-center mb-5 flex-wrap gap-4">

      <div class="flex items-center gap-2">
        <h2 class="text-base font-bold text-slate-800 uppercase tracking-wider">
          Manage Users
        </h2>
      </div>

      <button
        (click)="addUser.emit()"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 border border-transparent bg-slate-900 text-white shadow-sm hover:bg-slate-800 active:scale-[0.98]">

        Add User
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm">

      <div class="px-6 py-[18px] bg-slate-50/50 border-b border-slate-200/60 flex justify-between items-center gap-3 flex-wrap">

        <span class="font-bold text-sm text-slate-800 uppercase tracking-wider">
          Registered Users
        </span>

        <span class="text-xs bg-slate-200/60 px-2.5 py-1 rounded text-slate-600 font-semibold tracking-tight">
          {{ users.length }} USERS
        </span>
      </div>

      <div
        class="flex items-center justify-center gap-3 py-12 text-sm text-slate-400"
        *ngIf="usersLoading">

        <div class="w-5 h-5 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>

        Loading users...
      </div>

      <div class="overflow-x-auto" *ngIf="!usersLoading">

        <table class="w-full border-collapse min-w-[900px]">

          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/50">

              <th class="text-left px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                User Details
              </th>

              <th class="text-left px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Email
              </th>

              <th class="text-left px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Role
              </th>

              <th class="text-left px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>

              <th class="text-left px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Created
              </th>

              <th class="text-right px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            <tr
              *ngFor="let u of users"
              class="border-b border-slate-100/70 hover:bg-slate-50/50 transition-colors">

              <td class="px-4 py-3.5 align-middle">

                <div class="flex items-center gap-2.5">

                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                    [ngClass]="
                      u.role === 'Admin'
                        ? 'bg-amber-100/70 text-amber-700/70'
                        : 'bg-indigo-100/70 text-indigo-700/70'
                    ">

                    {{ getInitials(u.name || u.userId) }}
                  </div>

                  <div class="min-w-0">

                    <div
                      class="text-sm font-semibold text-slate-800 truncate"
                      [title]="u.name">

                      {{ u.name }}
                    </div>

                    <div
                      class="text-[10px] text-slate-400 mt-0.5 truncate"
                      [title]="u.userId">

                      {{ u.userId }}
                    </div>

                  </div>
                </div>
              

              <td class="px-4 py-3.5 align-middle whitespace-nowrap text-[12.5px] font-medium text-slate-600">

                <div class="truncate" [title]="u.email">
                  {{ u.email }}
                </div>
              

              <td class="px-4 py-3.5 align-middle whitespace-nowrap">

                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider min-w-[65px] justify-center"
                  [ngClass]="
                    u.role === 'Admin'
                      ? 'bg-amber-50 border border-amber-200/50'
                      : 'bg-indigo-50  border border-indigo-200/50'
                  ">

                  <i
                    class="ti text-[9px]"
                    [ngClass]="u.role === 'Admin' ? 'ti-crown' : 'ti-user'">
                  </i>

                  {{ u.role === 'Admin' ? 'Admin' : 'User' }}
                </span>
              

              <td class="px-4 py-3.5 align-middle whitespace-nowrap">

                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider min-w-[65px] justify-center"
                  [ngClass]="
                    u.isActive
                      ? 'bg-emerald-50  border border-emerald-200/50'
                      : 'bg-slate-100 text-slate-500 border border-slate-200/60'
                  ">

                  <i
                    class="ti text-[9px]"
                    [ngClass]="u.isActive ? 'ti-circle-check' : 'ti-circle-x'">
                  </i>

                  {{ u.isActive ? 'Active' : 'Inactive' }}
                </span>
              

              <td class="px-4 py-3.5 align-middle whitespace-nowrap text-[12.5px] font-medium text-slate-600">

                {{ u.createdAt | date:'d MMM yyyy' }}
              

              <td class="px-4 py-3.5 align-middle whitespace-nowrap text-right">

                <div class="flex gap-1.5 items-center justify-end">

                  <button
                    (click)="editUser.emit(u)"
                    class="w-7 h-7 rounded-md border border-slate-200 bg-white text-slate-500 cursor-pointer inline-flex items-center justify-center transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">

                    <img src="/edit.svg" alt="Edit" class="w-4 h-4" />
                  </button>

                  <button
                    (click)="deleteUser.emit(u)"
                    [disabled]="u._id === currentUser?._id"
                    class="w-7 h-7 rounded-md border border-slate-200 bg-white text-slate-500 cursor-pointer inline-flex items-center justify-center transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed">

                    <img src="/delete.svg" alt="Delete" class="w-4 h-4" />
                  </button>

                </div>
              

              
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class UsersSectionComponent {
  @Input() users: any[] = [];
  @Input() usersLoading = false;
  @Input() currentUser: any;

  @Input() getInitials!: (value: string) => string;

  @Output() addUser = new EventEmitter<void>();
  @Output() editUser = new EventEmitter<any>();
  @Output() deleteUser = new EventEmitter<any>();
}