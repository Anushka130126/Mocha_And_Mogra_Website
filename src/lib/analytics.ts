/**
 * Analytics — Google Analytics 4 + Meta Pixel
 *
 * Usage:
 *   Add to your .env file:
 *     VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
 *     VITE_META_PIXEL_ID=XXXXXXXXXXXXXXXX
 *
 *   Then call initAnalytics() once in main.tsx (after React renders).
 *
 * Both are no-ops if the env vars are not set — safe for development.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: (...args: unknown[]) => void };
    _fbq: Window['fbq'];
  }
}

// ─── Google Analytics 4 ─────────────────────────────────────────────────────

function loadGA4(measurementId: string) {
  // Inject gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Init dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    // Anonymise IPs for GDPR compliance
    anonymize_ip: true,
    // Don't send page views automatically — we fire them per route change
    send_page_view: false,
  });

  console.info(`[Analytics] GA4 loaded: ${measurementId}`);
}

/** Call this on every route change to track page views in GA4 */
export function trackPageView(path: string, title?: string) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title ?? document.title,
  });
}

/** Track a custom GA4 event */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params ?? {});
}

// ─── Meta Pixel ──────────────────────────────────────────────────────────────

function loadMetaPixel(pixelId: string) {
  // Meta Pixel base code (condensed, no external dependencies)
  (function (f, b, e, v, n?: () => void, t?: HTMLScriptElement, s?: Element | null) {
    if (f.fbq) return;
    n = f.fbq = function (...args: unknown[]) {
      if (n!.callMethod) n!.callMethod(...args);
      else n!.queue.push(args);
    } as Window['fbq'];
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v as string;
    s = b.getElementsByTagName(e)[0];
    s!.parentNode!.insertBefore(t, s!);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');

  // No-script fallback image (optional, helps with accuracy)
  const noscript = document.createElement('noscript');
  noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`;
  document.body.insertBefore(noscript, document.body.firstChild);

  console.info(`[Analytics] Meta Pixel loaded: ${pixelId}`);
}

/** Track a Meta Pixel standard event */
export function trackPixelEvent(
  eventName: string,
  params?: Record<string, string | number>
) {
  if (typeof window.fbq !== 'function') return;
  window.fbq('track', eventName, params ?? {});
}

// ─── Standard e-commerce events (call from cart/checkout pages) ──────────────

/** Call when user views a product (Shop page / product modal) */
export function trackViewContent(productName: string, value: number, currency = 'INR') {
  trackEvent('view_item', { item_name: productName, value, currency });
  trackPixelEvent('ViewContent', { content_name: productName, value, currency });
}

/** Call when user adds to cart */
export function trackAddToCart(productName: string, value: number, currency = 'INR') {
  trackEvent('add_to_cart', { item_name: productName, value, currency });
  trackPixelEvent('AddToCart', { content_name: productName, value, currency });
}

/** Call when user starts checkout */
export function trackInitiateCheckout(value: number, currency = 'INR') {
  trackEvent('begin_checkout', { value, currency });
  trackPixelEvent('InitiateCheckout', { value, currency });
}

/** Call on order confirmation */
export function trackPurchase(orderId: string, value: number, currency = 'INR') {
  trackEvent('purchase', { transaction_id: orderId, value, currency });
  trackPixelEvent('Purchase', { value, currency });
}

// ─── Init (call once) ────────────────────────────────────────────────────────

export function initAnalytics() {
  const ga4Id = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;
  const metaPixelId = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

  if (ga4Id) loadGA4(ga4Id);
  if (metaPixelId) loadMetaPixel(metaPixelId);

  if (!ga4Id && !metaPixelId) {
    console.info('[Analytics] No analytics IDs set — tracking disabled.');
  }
}
