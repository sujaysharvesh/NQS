import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { RecordService } from '../../core/services/record.service';

import {
  User,
  UserRole,
  CreateUserRequest,
  UpdateUserRequest,
} from '../../core/models/user.model';
import {
  AssignedTo,
  Record,
  CreateRecordRequest,
} from '../../core/models/record.model';

import { DropComponent } from '../../components/DropDown';
import {
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
  ROLE_OPTIONS,
  STATUS_OPTIONS,
  UserFilterOption,
} from './admin.constants';
import {
  getAssignedName,
  getInitials,
  getProgressColor,
  isOverdue,
} from './admin.helpers';
import { AdminHeaderComponent } from './component/admin-header.component';
import { AdminStatsComponent } from './component/admin-stats.component';
import { AdminTabsComponent } from './component/admin-tabs.component';
import { DeleteRecordConfirmComponent } from './component/delete-record.component';
import { DeleteUserConfirmComponent } from './component/delete-user-confirm.component';
import { RecordModalComponent } from './component/record-modal.component';
import { RecordsSectionComponent } from './component/records-section.component';
import { UserModalComponent } from './component/user-modal.component';
import { UsersSectionComponent } from './component/users-section.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DropComponent,
    AdminHeaderComponent,
    AdminStatsComponent,
    AdminTabsComponent,
    DeleteRecordConfirmComponent,
    DeleteUserConfirmComponent,
    RecordModalComponent,
    RecordsSectionComponent,
    UserModalComponent,
    UsersSectionComponent,
  ],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit, OnDestroy {
  user: User | null = null;
  users: User[] = [];
  records: Record[] = [];
  filteredRecords: Record[] = [];

  activeTab = 'users';

  usersLoading = false;
  recordsLoading = false;
  modalLoading = false;
  recordModalLoading = false;

  error = '';
  successMessage = '';

  showModal = false;
  editingUser: User | null = null;
  userForm!: FormGroup;
  showDeleteConfirm = false;
  userToDelete: User | null = null;

  showRecordModal = false;
  recordForm!: FormGroup;
  showDeleteRecordConfirm = false;
  recordToDelete: { _id: string; title: string } | null = null;

  filterUserId: string | null = null;
  userFilterOptions: UserFilterOption[] = [];

  roleOptions = ROLE_OPTIONS;
  statusOptions = STATUS_OPTIONS;
  priorityOptions = PRIORITY_OPTIONS;
  categoryOptions = CATEGORY_OPTIONS;

  private destroy$ = new Subject<void>();
  private msgTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private recordService: RecordService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    if (!this.user || this.user.role !== 'Admin') {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.initUserForm();
    this.loadAll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.msgTimer) clearTimeout(this.msgTimer);
  }

  get totalUsers() {
    return this.users.length;
  }

  get adminCount() {
    return this.users.filter(u => u.role === 'Admin').length;
  }

  get totalRecords() {
    return this.records.length;
  }

  get activeUsers() {
    return this.users.filter(u => u.isActive).length;
  }

  get mf() {
    return this.userForm.controls;
  }

  get rf() {
    return this.recordForm.controls;
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  private loadAll(): void {
    this.usersLoading = true;
    this.recordsLoading = true;

    forkJoin({
      users: this.userService.getAll(),
      records: this.recordService.getAllRecords(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ users, records }) => {
          this.users = users.data;
          this.records = records.data;
          this.refreshFilterOptions();
          this.filteredRecords = this.records;
          this.usersLoading = false;
          this.recordsLoading = false;
        },
        error: () => {
          this.error = 'Failed to load data. Please refresh.';
          this.usersLoading = false;
          this.recordsLoading = false;
        },
      });
  }

  private initUserForm(user?: User): void {
    this.userForm = this.fb.group({
      name: [user?.name ?? '', Validators.required],
      email: [user?.email ?? '', [Validators.required, Validators.email]],
      password: ['', this.editingUser ? [] : [Validators.required, Validators.minLength(4)]],
      role: [user?.role ?? ('' as UserRole), Validators.required],
      isActive: [user?.isActive ?? true],
    });
  }

  openAddModal(): void {
    this.editingUser = null;
    this.initUserForm();
    this.showModal = true;
    this.clearMessages();
  }

  openEditModal(user: User): void {
    this.editingUser = user;
    this.initUserForm(user);
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('role')?.disable();
    this.showModal = true;
    this.clearMessages();
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
    this.userForm.get('role')?.enable();
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.modalLoading = true;
    const raw = this.userForm.getRawValue();

    if (this.editingUser) {
      const payload: UpdateUserRequest = {
        name: raw.name,
        email: raw.email,
        isActive: raw.isActive,
      };

      this.userService
        .update(this.editingUser._id, payload)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.modalLoading = false)),
        )
        .subscribe({
          next: res => {
            const idx = this.users.findIndex(u => u._id === this.editingUser!._id);
            if (idx > -1) this.users[idx] = res.data;
            this.refreshFilterOptions();
            this.closeModal();
            this.showSuccess('User updated successfully.');
          },
          error: err => {
            this.error = err?.error?.message || 'Failed to update user.';
          },
        });
    } else {
      const payload: CreateUserRequest = {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role as UserRole,
      };

      this.userService
        .create(payload)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.modalLoading = false)),
        )
        .subscribe({
          next: res => {
            this.users = [...this.users, res.data];
            this.refreshFilterOptions();
            this.closeModal();
            this.showSuccess('User created successfully.');
          },
          error: err => {
            this.error = err?.error?.message || 'Failed to create user.';
          },
        });
    }
  }

  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.showDeleteConfirm = true;
    this.clearMessages();
  }

  deleteUser(): void {
    if (!this.userToDelete) return;

    const id = this.userToDelete._id;
    this.modalLoading = true;

    this.userService
      .delete(id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.modalLoading = false)),
      )
      .subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== id);
          this.refreshFilterOptions();

          if (this.filterUserId === this.userToDelete?._id) {
            this.filterUserId = null;
            this.filteredRecords = this.records;
          }

          this.showDeleteConfirm = false;
          this.userToDelete = null;
          this.showSuccess('User deleted successfully.');
        },
        error: err => {
          this.error = err?.error?.message || 'Failed to delete user.';
          this.showDeleteConfirm = false;
        },
      });
  }

  private refreshFilterOptions(): void {
    this.userFilterOptions = [
      { name: 'All Users', code: null },
      ...this.users.map(u => ({ name: u.name, code: u._id })),
    ];
  }

  private initRecordForm(): void {
    this.recordForm = this.fb.group({
      assignedTo: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      category: ['', Validators.required],
      dueDate: ['', Validators.required],
      progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  openAddRecordModal(): void {
    this.initRecordForm();
    this.showRecordModal = true;
    this.clearMessages();
  }

  closeRecordModal(): void {
    this.showRecordModal = false;
  }

  saveRecord(): void {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      return;
    }

    this.recordModalLoading = true;
    const raw = this.recordForm.getRawValue();

    const payload: CreateRecordRequest = {
      title: raw.title,
      description: raw.description,
      status: raw.status,
      priority: raw.priority,
      assignedTo: raw.assignedTo,
      category: raw.category,
      dueDate: new Date(raw.dueDate).toISOString(),
      progress: Number(raw.progress),
    };

    this.recordService
      .createRecord(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.recordModalLoading = false)),
      )
      .subscribe({
        next: res => {
          this.records = [...this.records, res.data];
          this.filteredRecords = this.filterUserId
            ? this.records.filter(
                r =>
                  r.assignedTo?._id === this.filterUserId ||
                  r.assignedTo?.userId === this.filterUserId,
              )
            : this.records;

          this.closeRecordModal();
          this.showSuccess('Record created successfully.');
        },
        error: err => {
          this.error = err?.error?.message || 'Failed to create record.';
        },
      });
  }

  confirmDeleteRecord(id: string): void {
    const record = this.records.find(r => r._id === id);
    if (!record) return;
    this.recordToDelete = { _id: record._id, title: record.title };
    this.showDeleteRecordConfirm = true;
    this.clearMessages();
  }

  deleteRecord(): void {
    if (!this.recordToDelete) return;

    const id = this.recordToDelete._id;
    this.recordModalLoading = true;

    this.recordService
      .deleteRecord(id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.recordModalLoading = false)),
      )
      .subscribe({
        next: () => {
          this.records = this.records.filter(r => r._id !== id);
          this.filteredRecords = this.filteredRecords.filter(r => r._id !== id);
          this.showDeleteRecordConfirm = false;
          this.recordToDelete = null;
          this.showSuccess('Record deleted successfully.');
        },
        error: err => {
          this.error = err?.error?.message || 'Failed to delete record.';
          this.showDeleteRecordConfirm = false;
        },
      });
  }

  applyFilter(selectedUserId: string | null): void {
    this.filterUserId = selectedUserId;
    this.filteredRecords = selectedUserId
      ? this.records.filter(
          r =>
            r.assignedTo?._id === selectedUserId ||
            r.assignedTo?.userId === selectedUserId,
        )
      : this.records;
  }

  getAssignedName = getAssignedName;
  getInitials = getInitials;
  isOverdue = isOverdue;
  getProgressColor = getProgressColor;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    this.error = '';
    if (this.msgTimer) clearTimeout(this.msgTimer);
    this.msgTimer = setTimeout(() => (this.successMessage = ''), 4000);
  }

  private clearMessages(): void {
    this.error = '';
    this.successMessage = '';
  }
}