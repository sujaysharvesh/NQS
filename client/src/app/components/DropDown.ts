import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

export interface DropOption {
  name: string;
  code: string | null;
}

@Component({
  selector: 'app-drop',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative font-sans select-none text-slate-800" [ngClass]="triggerWidth">
      
      <button
        type="button"
        class="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white pl-4 pr-3.5 py-2.5 text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
        [class.ring-2]="open"
        [class.ring-slate-900]="open"
        (click)="toggle()"
        aria-haspopup="listbox"
        [attr.aria-expanded]="open">
        
        <span class="truncate" [class.text-slate-400]="!value">
          {{ selectedLabel || placeholder }}
        </span>
        
        <i 
          class="ti ti-chevron-down text-slate-400 text-base transition-transform duration-200 ease-out flex-shrink-0"
          [class.rotate-180]="open">
        </i>
      </button>

      <div
        *ngIf="open && inline"
        class="w-full mt-2 rounded-xl border border-slate-100 bg-white p-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
        role="listbox">
        <div class="rounded-lg bg-slate-50/50 p-0.5">
          <button
            *ngFor="let item of options"
            type="button"
            class="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-150 focus:outline-none"
            [class.bg-slate-900]="item.code === value"
            [class.text-white]="item.code === value"
            [class.text-slate-600]="item.code !== value"
            [class.hover:bg-white]="item.code !== value"
            [class.hover:text-slate-900]="item.code !== value"
            [class.hover:shadow-sm]="item.code !== value"
            (click)="select(item)"
            role="option"
            [attr.aria-selected]="item.code === value">
            <span class="truncate">{{ item.name }}</span>
            <i *ngIf="item.code === value" class="ti ti-check text-base text-white"></i>
            <i *ngIf="item.code !== value" class="ti ti-check text-base text-transparent group-hover:text-slate-300 transition-colors duration-150"></i>
          </button>
        </div>
      </div>

      <div
        *ngIf="open && !inline"
        [ngClass]="['absolute z-50 mt-2 origin-top rounded-xl border border-slate-100 bg-white p-1 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]', dropWidth]"
        role="listbox">
        <div class="rounded-lg bg-slate-50/50 p-0.5 max-h-64 overflow-y-auto overflow-x-hidden">
          <button
            *ngFor="let item of options"
            type="button"
            class="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-150 focus:outline-none"
            [class.bg-slate-900]="item.code === value"
            [class.text-white]="item.code === value"
            [class.text-slate-600]="item.code !== value"
            [class.hover:bg-white]="item.code !== value"
            [class.hover:text-slate-900]="item.code !== value"
            [class.hover:shadow-sm]="item.code !== value"
            (click)="select(item)"
            role="option"
            [attr.aria-selected]="item.code === value">
            <span class="truncate">{{ item.name }}</span>
            <i *ngIf="item.code === value" class="ti ti-check text-base text-white"></i>
            <i *ngIf="item.code !== value" class="ti ti-check text-base text-transparent group-hover:text-slate-300 transition-colors duration-150"></i>
          </button>
        </div>
      </div>

    </div>
  `,
})
export class DropComponent {
  @Input() options: DropOption[] = [];
  @Input() placeholder = 'Choose option...';
  @Input() value: string | null = null;
  @Input() inline = false;
  @Input() triggerWidth = 'w-full';   
  @Input() dropWidth = 'w-full';      

  @Output() valueChange = new EventEmitter<string | null>();

  open = false;

  constructor(private elRef: ElementRef) {}

  get selectedLabel(): string {
    return this.options.find(o => o.code === this.value)?.name || '';
  }

  toggle(): void {
    this.open = !this.open;
  }

  select(item: DropOption): void {
    this.value = item.code;
    this.valueChange.emit(item.code);
    this.open = false;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.open = false;
    }
  }
}