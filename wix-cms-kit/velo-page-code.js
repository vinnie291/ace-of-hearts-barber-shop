/**
 * ============================================================================
 * ACE OF HEARTS BARBERSHOP — WIX VELO CMS BRIDGE (velo-page-code.js)
 * Production Domain: https://www.aceofheartsbarbershop.com/
 * ============================================================================
 *
 * HOW THIS WORKS:
 * 1. In Wix Editor / Wix Studio, turn on Dev Mode (Velo) and import the CSV
 *    files from `wix-cms-kit/collections/` into Wix CMS (Content Manager):
 *    - `Services`      (from Services.csv)
 *    - `Gallery`       (from Gallery.csv)
 *    - `Reviews`       (from Reviews.csv)
 *    - `FAQs`          (from FAQs.csv)
 *    - `Hours`         (from Hours.csv)
 *    - `SiteSettings`  (from SiteSettings.csv)
 *
 * 2. Paste this file into your Home page's Velo Page Code (`Home.js`).
 *    - If you use an HTML Embed (`#html1`) containing `index.html`, this script
 *      automatically queries all 6 Wix CMS collections and sends them into
 *      `#html1` via `postMessage({ type: 'WIX_CMS_DATA', payload })`.
 *    - Whenever you edit a price, service description, photo, review, FAQ, or
 *      shop hour in the Wix CMS dashboard, the live website updates automatically!
 * ============================================================================
 */

import wixData from 'wix-data';
import wixSeoFrontend from 'wix-seo-frontend';
import wixLocationFrontend from 'wix-location-frontend';

// Helper: safely query a Wix CMS collection without failing if a collection is not created yet
async function safeQueryCollection(collectionId, sortField = 'sortOrder') {
  try {
    let query = wixData.query(collectionId).limit(100);
    if (sortField) {
      query = query.ascending(sortField);
    }
    const result = await query.find();
    return result.items || [];
  } catch (err) {
    console.warn(`[Ace CMS Bridge] Optional collection "${collectionId}" not found or empty:`, err?.message || err);
    return [];
  }
}

$w.onReady(async function () {
  // 1. Fetch all CMS collections in parallel from Wix Content Manager
  const [services, gallery, reviews, faqs, hours, settingsRows] = await Promise.all([
    safeQueryCollection('Services', 'sortOrder'),
    safeQueryCollection('Gallery', 'sortOrder'),
    safeQueryCollection('Reviews', 'sortOrder'),
    safeQueryCollection('FAQs', 'sortOrder'),
    safeQueryCollection('Hours', 'sortOrder'),
    safeQueryCollection('SiteSettings', null)
  ]);

  const settings = settingsRows[0] || null;
  const cmsPayload = {
    services,
    gallery,
    reviews,
    faqs,
    hours,
    settings
  };

  // 2. Send CMS data to the embedded HTML component (#html1) if present
  const htmlEmbed = $w('#html1');
  if (htmlEmbed && typeof htmlEmbed.postMessage === 'function') {
    const pushToEmbed = () => {
      htmlEmbed.postMessage({
        type: 'WIX_CMS_DATA',
        payload: cmsPayload
      });
    };

    // Push immediately on page ready AND whenever the iframe signals ACE_WIX_READY,
    // and handle external link navigation outside the sandboxed iframe.
    pushToEmbed();
    htmlEmbed.onMessage((event) => {
      if (event?.data?.type === 'ACE_WIX_READY') {
        pushToEmbed();
      } else if (event?.data?.type === 'ACE_OPEN_URL' && event.data.url) {
        wixLocationFrontend.to(event.data.url);
      }
    });
  }

  // 3. Optional: If using Native Wix Repeaters instead of #html1, bind them automatically
  if ($w('#servicesRepeater').type === '$w.Repeater' && services.length > 0) {
    $w('#servicesRepeater').data = services.map((item, i) => ({ ...item, _id: item._id || String(i + 1) }));
    $w('#servicesRepeater').onItemReady(($item, itemData) => {
      if ($item('#serviceTitle').type) $item('#serviceTitle').text = itemData.title || '';
      if ($item('#servicePrice').type) $item('#servicePrice').text = itemData.price || '';
      if ($item('#serviceDuration').type) $item('#serviceDuration').text = itemData.duration || '';
      if ($item('#serviceDescription').type) $item('#serviceDescription').text = itemData.description || '';
      if ($item('#serviceBookBtn').type) {
        $item('#serviceBookBtn').link = itemData.booksyUrl;
        $item('#serviceBookBtn').target = '_blank';
      }
    });
  }

  // 4. Inject Schema.org JSON-LD into the top-level Wix page <head> for Google Rich Results & AEO
  if (wixSeoFrontend && typeof wixSeoFrontend.setStructuredData === 'function') {
    wixSeoFrontend.setStructuredData([
      {
        '@context': 'https://schema.org',
        '@type': ['BarberShop', 'HealthAndBeautyBusiness', 'LocalBusiness'],
        '@id': 'https://www.aceofheartsbarbershop.com/#barbershop',
        name: settings?.businessName || 'Ace of Hearts Barbershop',
        slogan: settings?.tagline || 'Looks Good, Feel Good',
        url: 'https://www.aceofheartsbarbershop.com/',
        telephone: '+1-703-655-1109',
        email: settings?.email || 'aceofheartsbarbershop@gmail.com',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '10621 Braddock Rd J, Suite 28 (2nd Floor, Sola Salon Studios — University Mall)',
          addressLocality: 'Fairfax',
          addressRegion: 'VA',
          postalCode: '22032',
          addressCountry: 'US'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 38.8286,
          longitude: -77.3119
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          bestRating: '5',
          ratingCount: '137',
          reviewCount: '137'
        }
      }
    ]);
  }
});
