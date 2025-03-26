import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p>This area requires admin privileges.</p>
        <button class="btn btn-primary" (click)="goBack()">Go Back</button>
        <button class="btn btn-secondary" (click)="goHome()">Go to Home</button>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    
    .unauthorized-card {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 30px;
      width: 100%;
      max-width: 500px;
      text-align: center;
    }
    
    .icon {
      color: #e74c3c;
      margin-bottom: 20px;
    }
    
    h1 {
      color: #333;
      margin-bottom: 16px;
    }
    
    p {
      color: #666;
      margin-bottom: 8px;
      font-size: 16px;
    }
    
    .btn {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
      margin: 10px;
    }
    
    .btn-primary {
      background-color: #4a69bd;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #3c5aa6;
    }
    
    .btn-secondary {
      background-color: #f1f2f6;
      color: #333;
    }
    
    .btn-secondary:hover {
      background-color: #dfe4ea;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack(): void {
    window.history.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
