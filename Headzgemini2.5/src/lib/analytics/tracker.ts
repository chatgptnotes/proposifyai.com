'use client';

export interface TrackingEvent {
  proposalId: string;
  eventType: 'page_view' | 'section_view' | 'scroll' | 'click' | 'time_spent' | 'download';
  eventData?: Record<string, any>;
  sessionId: string;
}

class ProposalTracker {
  private proposalId: string | null = null;
  private sessionId: string;
  private startTime: number = 0;
  private lastScrollDepth: number = 0;
  private viewedSections: Set<string> = new Set();
  private sectionStartTimes: Map<string, number> = new Map();
  private isTracking: boolean = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private async sendEvent(event: Omit<TrackingEvent, 'sessionId'>) {
    if (!this.proposalId) return;

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          sessionId: this.sessionId,
        }),
      });
    } catch (error) {
      console.error('Failed to send tracking event:', error);
    }
  }

  init(proposalId: string) {
    if (this.isTracking) {
      this.stop();
    }

    this.proposalId = proposalId;
    this.startTime = Date.now();
    this.isTracking = true;

    this.trackPageView();
    this.setupScrollTracking();
    this.setupVisibilityTracking();
    this.startHeartbeat();
  }

  stop() {
    if (!this.isTracking) return;

    this.trackTimeSpent();
    this.stopHeartbeat();
    this.isTracking = false;
  }

  private trackPageView() {
    this.sendEvent({
      proposalId: this.proposalId!,
      eventType: 'page_view',
      eventData: {
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      },
    });
  }

  private setupScrollTracking() {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollDepth = this.calculateScrollDepth();

        if (scrollDepth > this.lastScrollDepth + 10) {
          this.lastScrollDepth = scrollDepth;
          this.sendEvent({
            proposalId: this.proposalId!,
            eventType: 'scroll',
            eventData: {
              scrollDepth,
              timestamp: new Date().toISOString(),
            },
          });
        }

        this.checkVisibleSections();
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }

  private calculateScrollDepth(): number {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const scrolled = scrollTop + windowHeight;

    return Math.round((scrolled / documentHeight) * 100);
  }

  private checkVisibleSections() {
    const sections = document.querySelectorAll('[data-section-id]');

    sections.forEach(section => {
      const sectionId = section.getAttribute('data-section-id');
      if (!sectionId) return;

      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible && !this.viewedSections.has(sectionId)) {
        this.viewedSections.add(sectionId);
        this.sectionStartTimes.set(sectionId, Date.now());

        this.sendEvent({
          proposalId: this.proposalId!,
          eventType: 'section_view',
          eventData: {
            sectionId,
            sectionTitle: section.getAttribute('data-section-title') || sectionId,
            timestamp: new Date().toISOString(),
          },
        });
      }

      if (!isVisible && this.sectionStartTimes.has(sectionId)) {
        const startTime = this.sectionStartTimes.get(sectionId)!;
        const timeSpent = Math.round((Date.now() - startTime) / 1000);

        if (timeSpent > 2) {
          this.sendEvent({
            proposalId: this.proposalId!,
            eventType: 'time_spent',
            eventData: {
              sectionId,
              timeSpent,
              timestamp: new Date().toISOString(),
            },
          });
        }

        this.sectionStartTimes.delete(sectionId);
      }
    });
  }

  private setupVisibilityTracking() {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        this.trackTimeSpent();
        this.stopHeartbeat();
      } else {
        this.startTime = Date.now();
        this.startHeartbeat();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }

  private trackTimeSpent() {
    const timeSpent = Math.round((Date.now() - this.startTime) / 1000);

    if (timeSpent > 1) {
      this.sendEvent({
        proposalId: this.proposalId!,
        eventType: 'time_spent',
        eventData: {
          timeSpent,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      this.trackTimeSpent();
      this.startTime = Date.now();
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  trackClick(elementId: string, elementType: string, elementText?: string) {
    this.sendEvent({
      proposalId: this.proposalId!,
      eventType: 'click',
      eventData: {
        elementId,
        elementType,
        elementText,
        timestamp: new Date().toISOString(),
      },
    });
  }

  trackDownload(fileName: string, fileType: string) {
    this.sendEvent({
      proposalId: this.proposalId!,
      eventType: 'download',
      eventData: {
        fileName,
        fileType,
        timestamp: new Date().toISOString(),
      },
    });
  }

  getSectionTimeSpent(sectionId: string): number {
    if (!this.sectionStartTimes.has(sectionId)) return 0;

    const startTime = this.sectionStartTimes.get(sectionId)!;
    return Math.round((Date.now() - startTime) / 1000);
  }

  getSessionDuration(): number {
    return Math.round((Date.now() - this.startTime) / 1000);
  }

  getViewedSections(): string[] {
    return Array.from(this.viewedSections);
  }

  getScrollDepth(): number {
    return this.lastScrollDepth;
  }
}

export const tracker = new ProposalTracker();

export function useProposalTracking(proposalId: string) {
  if (typeof window === 'undefined') return;

  tracker.init(proposalId);

  const cleanup = () => {
    tracker.stop();
  };

  window.addEventListener('beforeunload', cleanup);

  return () => {
    cleanup();
    window.removeEventListener('beforeunload', cleanup);
  };
}
