interface PerformanceMetrics {
  loadTime: number;
  dataSize: number;
  cacheHit: boolean;
  errorCount: number;
  timestamp: number;
}

interface MenuPerformanceData {
  visas: PerformanceMetrics[];
  guides: PerformanceMetrics[];
  clkr: PerformanceMetrics[];
  blog: PerformanceMetrics[];
}

class MenuPerformanceMonitor {
  private metrics: MenuPerformanceData = {
    visas: [],
    guides: [],
    clkr: [],
    blog: []
  };

  private startTimes: Record<string, number> = {};

  startTimer(dataType: keyof MenuPerformanceData) {
    this.startTimes[dataType] = performance.now();
  }

  endTimer(dataType: keyof MenuPerformanceData, dataSize: number, cacheHit: boolean = false, error: boolean = false) {
    const startTime = this.startTimes[dataType];
    if (!startTime) return;

    const loadTime = performance.now() - startTime;
    
    this.metrics[dataType].push({
      loadTime,
      dataSize,
      cacheHit,
      errorCount: error ? 1 : 0,
      timestamp: Date.now()
    });

    // Keep only last 10 metrics per type
    if (this.metrics[dataType].length > 10) {
      this.metrics[dataType] = this.metrics[dataType].slice(-10);
    }
  }

  getMetrics(dataType?: keyof MenuPerformanceData) {
    if (dataType) {
      return this.metrics[dataType];
    }
    return this.metrics;
  }

  getAverageLoadTime(dataType: keyof MenuPerformanceData): number {
    const metrics = this.metrics[dataType];
    if (metrics.length === 0) return 0;
    
    const totalTime = metrics.reduce((sum, metric) => sum + metric.loadTime, 0);
    return totalTime / metrics.length;
  }

  getErrorRate(dataType: keyof MenuPerformanceData): number {
    const metrics = this.metrics[dataType];
    if (metrics.length === 0) return 0;
    
    const totalErrors = metrics.reduce((sum, metric) => sum + metric.errorCount, 0);
    return totalErrors / metrics.length;
  }

  getCacheHitRate(dataType: keyof MenuPerformanceData): number {
    const metrics = this.metrics[dataType];
    if (metrics.length === 0) return 0;
    
    const cacheHits = metrics.filter(metric => metric.cacheHit).length;
    return cacheHits / metrics.length;
  }

  generateReport(): string {
    const report = {
      visas: {
        avgLoadTime: this.getAverageLoadTime('visas'),
        errorRate: this.getErrorRate('visas'),
        cacheHitRate: this.getCacheHitRate('visas'),
        totalRequests: this.metrics.visas.length
      },
      guides: {
        avgLoadTime: this.getAverageLoadTime('guides'),
        errorRate: this.getErrorRate('guides'),
        cacheHitRate: this.getCacheHitRate('guides'),
        totalRequests: this.metrics.guides.length
      },
      clkr: {
        avgLoadTime: this.getAverageLoadTime('clkr'),
        errorRate: this.getErrorRate('clkr'),
        cacheHitRate: this.getCacheHitRate('clkr'),
        totalRequests: this.metrics.clkr.length
      },
      blog: {
        avgLoadTime: this.getAverageLoadTime('blog'),
        errorRate: this.getErrorRate('blog'),
        cacheHitRate: this.getCacheHitRate('blog'),
        totalRequests: this.metrics.blog.length
      }
    };

    return JSON.stringify(report, null, 2);
  }

  clearMetrics() {
    this.metrics = {
      visas: [],
      guides: [],
      clkr: [],
      blog: []
    };
    this.startTimes = {};
  }
}

// Export singleton instance
export const menuPerformanceMonitor = new MenuPerformanceMonitor();

// Utility functions for easy usage
export const startMenuTimer = (dataType: keyof MenuPerformanceData) => {
  menuPerformanceMonitor.startTimer(dataType);
};

export const endMenuTimer = (dataType: keyof MenuPerformanceData, dataSize: number, cacheHit: boolean = false, error: boolean = false) => {
  menuPerformanceMonitor.endTimer(dataType, dataSize, cacheHit, error);
};

export const getMenuPerformanceReport = () => {
  return menuPerformanceMonitor.generateReport();
}; 