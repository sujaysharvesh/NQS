import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { Record } from '../../core/models/record.model';
import { Subject, takeUntil } from 'rxjs';
import { RecordService } from '../../core/services/record.service';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector      : 'app-dashboard',
  standalone : true,
  imports    : [CommonModule, RouterModule, TableModule, SkeletonModule],
  templateUrl: './dashboard.component.html',
  encapsulation : ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {

  user    : User | null = null;
  records : Record[]    = [];
  loading  = false;
  error    = '';

  skeletonRows = Array.from({ length: 5 }).map(() => ({})); 
  
  private destroy$ = new Subject<void>();

  constructor(
    private authService  : AuthService,
    private recordService: RecordService,
    private router       : Router,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
    if (!this.user) { 
      this.router.navigate(['/login']); 
      return; 
    }
    this.loadRecords();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get initials(): string {
    return this.user?.userId?.slice(0, 2).toUpperCase() ?? '??';
  }

  get activeCount()  { return this.records.filter(r => r.status === 'Active').length; }
  get pendingCount() { return this.records.filter(r => r.status === 'Pending').length; }
  get archivedCount(){ return this.records.filter(r => r.status === 'Archived').length; }

  getInitials(name: string): string {
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  }

  isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date();
  }

  getProgressColor(progress: number, status: string): string {
    if (status === 'Archived' && progress === 100) return '#4ade80';
    if (progress < 30) return '#f87171';
    return '#6366f1';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private loadRecords(): void {
    this.loading = true;
    this.error = '';
    this.recordService.getRecords()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next : res => { 
          this.records = res.data || []; 
          this.loading = false; 
        },
        error: ()  => { 
          this.error = 'Failed to load records.'; 
          this.loading = false; 
        },
      });
  }
}