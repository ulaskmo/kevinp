import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  filterType: string = 'all';
  analyticsEnabled: boolean = true;
  
  // Analytics summary
  summary = {
    totalEvents: 0,
    pageViews: 0,
    userActions: 0,
    errors: 0
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    // Track this page view
    this.analyticsService.trackPageView('Analytics Dashboard');
    
    // Load events
    this.loadEvents();
  }

  loadEvents(): void {
    this.events = this.analyticsService.getEvents();
    this.filterEvents();
    this.calculateSummary();
  }

  filterEvents(): void {
    if (this.filterType === 'all') {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter(event => event.type === this.filterType);
    }
  }

  calculateSummary(): void {
    this.summary.totalEvents = this.events.length;
    this.summary.pageViews = this.events.filter(event => event.type === 'PAGE_VIEW').length;
    this.summary.userActions = this.events.filter(event => event.type === 'EVENT').length;
    this.summary.errors = this.events.filter(event => event.type === 'ERROR').length;
  }

  toggleAnalytics(): void {
    this.analyticsEnabled = !this.analyticsEnabled;
    this.analyticsService.setEnabled(this.analyticsEnabled);
    
    // Track this action
    if (this.analyticsEnabled) {
      this.analyticsService.trackEvent('Analytics', 'Enable', 'Analytics Dashboard');
    }
  }

  clearEvents(): void {
    if (confirm('Are you sure you want to clear all analytics events?')) {
      this.analyticsService.clearEvents();
      this.loadEvents();
    }
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
