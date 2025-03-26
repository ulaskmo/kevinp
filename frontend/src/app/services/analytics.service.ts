import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private events: any[] = [];
  private isEnabled = true;

  constructor() {
    // Initialize analytics
    console.log('Analytics service initialized');
  }

  // Enable or disable analytics tracking
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log(`Analytics tracking ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Track a page view
  trackPageView(pageName: string): void {
    if (!this.isEnabled) return;
    
    const event = {
      type: 'PAGE_VIEW',
      pageName,
      timestamp: new Date().toISOString(),
    };
    
    this.events.push(event);
    console.log(`Analytics: Page view - ${pageName}`);
    
    // In a real implementation, you would send this to an analytics service
    this.sendToAnalyticsService(event);
  }

  // Track a user action
  trackEvent(category: string, action: string, label?: string, value?: number): void {
    if (!this.isEnabled) return;
    
    const event = {
      type: 'EVENT',
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString(),
    };
    
    this.events.push(event);
    console.log(`Analytics: Event - ${category} / ${action} ${label ? '/ ' + label : ''} ${value ? '/ ' + value : ''}`);
    
    // In a real implementation, you would send this to an analytics service
    this.sendToAnalyticsService(event);
  }

  // Track a user error
  trackError(errorType: string, errorMessage: string): void {
    if (!this.isEnabled) return;
    
    const event = {
      type: 'ERROR',
      errorType,
      errorMessage,
      timestamp: new Date().toISOString(),
    };
    
    this.events.push(event);
    console.log(`Analytics: Error - ${errorType} / ${errorMessage}`);
    
    // In a real implementation, you would send this to an analytics service
    this.sendToAnalyticsService(event);
  }

  // Get all tracked events (for demonstration purposes)
  getEvents(): any[] {
    return [...this.events];
  }

  // Clear all tracked events (for demonstration purposes)
  clearEvents(): void {
    this.events = [];
    console.log('Analytics: Events cleared');
  }

  // Simulate sending to an analytics service
  private sendToAnalyticsService(event: any): void {
    // In a real implementation, this would send the event to Google Analytics, Mixpanel, etc.
    // For now, we'll just log it to the console
    console.debug('Analytics event sent:', event);
  }
}
