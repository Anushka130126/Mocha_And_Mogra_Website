// Shopify Headless Integration Helper

export const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '1fieuf-bz.myshopify.com';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

/**
 * Executes a GraphQL query against the Shopify Storefront API.
 */
export async function shopifyFetch({ query, variables = {} }: { query: string; variables?: Record<string, unknown> }) {
  if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.error('Missing VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN');
    return { status: 500, body: { data: null } };
  }

  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const body = await response.json();

    if (body.errors) {
      console.error('Shopify GraphQL Errors:', body.errors);
      return { status: 500, body, error: body.errors[0].message };
    }

    return { status: response.status, body };
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    return { status: 500, body: { data: null }, error: 'Network error' };
  }
}

/**
 * Creates a Shopify checkout using the Storefront API `checkoutCreate` mutation.
 */
export async function createShopifyCheckout(items: { variantId?: string | number; quantity: number }[]) {
  if (!items || items.length === 0) {
    return `https://${SHOPIFY_STORE_DOMAIN}/checkout`;
  }

  // Ensure IDs are properly formatted for GraphQL (e.g. gid://shopify/ProductVariant/...)
  const lineItems = items.map(item => {
    let idStr = String(item.variantId);
    if (!idStr.startsWith('gid://')) {
      idStr = `gid://shopify/ProductVariant/${idStr}`;
    }
    return {
      variantId: idStr,
      quantity: item.quantity
    };
  });

  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems
    }
  };

  const response = await shopifyFetch({ query, variables });

  if (response.body?.data?.checkoutCreate?.checkout?.webUrl) {
    return response.body.data.checkoutCreate.checkout.webUrl;
  }

  console.error('Failed to create checkout:', response.body?.data?.checkoutCreate?.checkoutUserErrors);
  
  // Fallback to cart permalink if mutation fails
  return createDirectShopifyCheckout(items);
}

/**
 * Creates a direct Shopify checkout URL using standard cart permalink format.
 * (Fallback method)
 */
export function createDirectShopifyCheckout(items: { variantId?: string | number; quantity: number }[]) {
  if (!items || items.length === 0) {
    return `https://${SHOPIFY_STORE_DOMAIN}/checkout`;
  }

  // Filter for real numeric/Shopify variant IDs (e.g. 4567890123)
  const validVariantItems = items.filter((item) => {
    const id = String(item.variantId || '');
    return id.length >= 8 || id.startsWith('gid://');
  });

  if (validVariantItems.length > 0) {
    const cartItems = validVariantItems
      .map((item) => {
        const cleanId = String(item.variantId).replace('gid://shopify/ProductVariant/', '');
        return `${cleanId}:${item.quantity}`;
      })
      .join(',');
    return `https://${SHOPIFY_STORE_DOMAIN}/cart/${cartItems}`;
  }

  return `https://${SHOPIFY_STORE_DOMAIN}/checkout`;
}

export const getProductsQuery = `{ products(first: 10) { edges { node { id title } } } }`;
