import { Component, OnInit, OnDestroy }   from '@angular/core';
import { CommonModule }                    from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule }            from '@angular/router';
import { Subject }                         from 'rxjs';
import { takeUntil, finalize }             from 'rxjs/operators';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardComponent } from "../../dashboard/dashboard.component";

@Component({
  selector   : 'app-login',
  standalone : true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FloatLabelModule, InputTextModule, DashboardComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!  : FormGroup;
  loading      = false;
  errorMessage = '';
  showPassword = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb         : FormBuilder,
    private authService: AuthService,
    private router     : Router,
  ) {}

  ngOnInit(): void {

    if (this.authService.isLoggedIn()) {
  
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }
  
      return;
    }
  
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() { return this.loginForm.controls; }

  togglePassword(): void { this.showPassword = !this.showPassword; }

  private redirectAfterLogin(role: string): void {
    this.router.navigate([role === 'Admin' ? '/admin' : '/dashboard']);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading      = true;
    this.errorMessage = '';

    this.authService
      .login(this.loginForm.value)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next : res => { if (res.success) this.redirectAfterLogin(res.data.user.role); },
        error: err  => {
          this.errorMessage = err?.error?.message || 'Invalid credentials. Please try again.';
        },
      });
  }
}