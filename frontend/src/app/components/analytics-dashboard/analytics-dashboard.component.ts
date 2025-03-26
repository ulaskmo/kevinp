import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../services/analytics.service';
import { AnalyticsApiService } from '../../services/analytics-api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {
  // User events tracking
  events: any[] = [];
  filteredEvents: any[] = [];
  filterType: string = 'all';
  analyticsEnabled: boolean = true;
  
  // Movie analytics data
  movieAnalytics: any = null;
  loading: boolean = false;
  error: string | null = null;
  
  // Date filters
  startDate: string;
  endDate: string;
  
  // Analytics summary
  summary = {
    totalEvents: 0,
    pageViews: 0,
    userActions: 0,
    errors: 0
  };

  constructor(
    private analyticsService: AnalyticsService,
    private analyticsApiService: AnalyticsApiService
  ) {
    // Initialize date filters to last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    this.startDate = this.formatDate(thirtyDaysAgo);
    this.endDate = this.formatDate(today);
  }

  ngOnInit(): void {
    // Track this page view
    this.analyticsService.trackPageView('Analytics Dashboard');
    
    // Load user events
    this.loadEvents();
    
    // Load movie analytics data
    this.loadMovieAnalytics();
  }

  // Format date for input fields
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Load user events
  loadEvents(): void {
    this.events = this.analyticsService.getEvents();
    this.filterEvents();
    this.calculateSummary();
  }

  // Filter user events by type
  filterEvents(): void {
    if (this.filterType === 'all') {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter(event => event.type === this.filterType);
    }
  }

  // Calculate user events summary
  calculateSummary(): void {
    this.summary.totalEvents = this.events.length;
    this.summary.pageViews = this.events.filter(event => event.type === 'PAGE_VIEW').length;
    this.summary.userActions = this.events.filter(event => event.type === 'EVENT').length;
    this.summary.errors = this.events.filter(event => event.type === 'ERROR').length;
  }

  // Load movie analytics data from API
  loadMovieAnalytics(): void {
    this.loading = true;
    this.error = null;
    
    this.analyticsApiService.getMovieAnalytics().subscribe({
      next: (data) => {
        this.movieAnalytics = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading movie analytics:', err);
        this.error = 'Failed to load movie analytics data. Please try again.';
        this.loading = false;
      }
    });
  }

  // Load analytics for a specific time period
  loadAnalyticsForPeriod(): void {
    if (!this.startDate || !this.endDate) {
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    
    this.analyticsApiService.getAnalyticsForPeriod(startDate, endDate).subscribe({
      next: (data) => {
        this.movieAnalytics = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading analytics for period:', err);
        this.error = 'Failed to load analytics data for the selected period.';
        this.loading = false;
      }
    });
  }

  // Calculate total views from top viewed movies
  getTotalViews(): number {
    if (!this.movieAnalytics || !this.movieAnalytics.topViewed) {
      return 0;
    }
    
    return this.movieAnalytics.topViewed.reduce((total: number, movie: any) => {
      return total + (movie.viewCount || 0);
    }, 0);
  }

  // Toggle analytics tracking
  toggleAnalytics(): void {
    this.analyticsEnabled = !this.analyticsEnabled;
    this.analyticsService.setEnabled(this.analyticsEnabled);
    
    // Track this action
    if (this.analyticsEnabled) {
      this.analyticsService.trackEvent('Analytics', 'Enable', 'Analytics Dashboard');
    }
  }

  // Clear user events
  clearEvents(): void {
    if (confirm('Are you sure you want to clear all analytics events?')) {
      this.analyticsService.clearEvents();
      this.loadEvents();
    }
  }

  // Refresh all data
  refreshData(): void {
    this.loadEvents();
    this.loadMovieAnalytics();
  }

  // Generate a test event for demonstration
  generateTestEvent(): void {
    const eventTypes = ['PAGE_VIEW', 'EVENT', 'ERROR'];
    const pages = ['Home', 'Movie List', 'Movie Details', 'Add Movie', 'Edit Movie'];
    const actions = ['Click', 'Submit', 'Delete', 'Edit', 'View'];
    const errors = ['API Error', 'Validation Error', 'Authentication Error'];
    
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    if (randomType === 'PAGE_VIEW') {
      const page = pages[Math.floor(Math.random() * pages.length)];
      this.analyticsService.trackPageView(page);
    } else if (randomType === 'EVENT') {
      const category = 'Test';
      const action = actions[Math.floor(Math.random() * actions.length)];
      const value = Math.floor(Math.random() * 100);
      this.analyticsService.trackEvent(category, action, 'Test Label', value);
    } else if (randomType === 'ERROR') {
      const errorType = errors[Math.floor(Math.random() * errors.length)];
      this.analyticsService.trackError(errorType, 'This is a test error message');
    }
    
    // Reload events
    this.loadEvents();
  }
}
