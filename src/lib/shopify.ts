const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: any;
}): Promise<{ status: number; body: T }> {
  if (!domain || !storefrontAccessToken) {
    throw new Error(
      'Shopify credentials are not set in environment variables. ' +
      'Please set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env'
    );
  }

  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  const result = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({
      ...(query && { query }),
      ...(variables && { variables }),
    }),
  });

  const body = await result.json();

  if (body.errors) {
    throw body.errors[0];
  }

  return {
    status: result.status,
    body,
  };
}

// ─── GraphQL Query: Get Products ──────────────────────────────────────────────

export const getProductsQuery = `
  query getProducts {
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 5) {
            edges {
              node {
                id
                title
                price {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ─── GraphQL Mutation: Create Cart & Checkout URL ──────────────────────────────

export const createCartMutation = `
  mutation createCart($cartInput: CartInput!) {
    cartCreate(input: $cartInput) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Creates a real Shopify checkout session for the items in cart
 * Returns the checkoutUrl to redirect the user to Shopify Checkout
 */
export async function createShopifyCheckout(
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<string> {
  const res = await shopifyFetch<any>({
    query: createCartMutation,
    variables: {
      cartInput: {
        lines,
      },
    },
  });

  const cartData = res.body?.data?.cartCreate;
  if (cartData?.userErrors?.length > 0) {
    throw new Error(cartData.userErrors[0].message);
  }

  return cartData?.cart?.checkoutUrl;
}
