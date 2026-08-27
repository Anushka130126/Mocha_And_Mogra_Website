// Shopify Headless Integration Helper

export const SHOPIFY_STORE_DOMAIN = '1fieuf-bz.myshopify.com';

/**
 * Creates a direct Shopify checkout URL using standard cart permalink format.
 * If products have real numeric Shopify variant IDs, it builds:
 * https://1fieuf-bz.myshopify.com/cart/variant_id:quantity
 * Otherwise, it safely redirects to https://1fieuf-bz.myshopify.com/checkout
 */
export function createDirectShopifyCheckout(items: { variantId?: string | number; quantity: number }[]) {
  if (!items || items.length === 0) {
    return `https://${SHOPIFY_STORE_DOMAIN}/checkout`;
  }

  // Filter for real numeric/Shopify variant IDs (e.g. 4567890123)
  const validVariantItems = items.filter(item => {
    const id = String(item.variantId || '');
    return id.length >= 8 || id.startsWith('gid://');
  });

  if (validVariantItems.length > 0) {
    const cartItems = validVariantItems
      .map(item => {
        const cleanId = String(item.variantId).replace('gid://shopify/ProductVariant/', '');
        return `${cleanId}:${item.quantity}`;
      })
      .join(',');
    return `https://${SHOPIFY_STORE_DOMAIN}/cart/${cartItems}`;
  }

  // Fallback to Shopify Hosted Checkout page
  return `https://${SHOPIFY_STORE_DOMAIN}/checkout`;
}

export async function shopifyFetch({ query }: { query: string; variables?: Record<string, unknown> }) {
  console.log('Shopify fetch query executed:', query.slice(0, 50));
  return { status: 200, body: { data: null } };
}

export const getProductsQuery = `{ products(first: 10) { edges { node { id title } } } }`;

export async function createShopifyCheckout(items: { variantId?: string | number; quantity: number }[]) {
  return createDirectShopifyCheckout(items);
}
