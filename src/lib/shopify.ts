const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: any;
}): Promise<{ status: number; body: T } | never> {
  try {
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
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    throw error;
  }
}

// Example GraphQL Query to get products
export const getProductsQuery = `
  query getProducts {
    products(first: 10) {
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
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;

// Example mutation to create checkout/cart (using Shopify's Cart API)
export const createCartMutation = `
  mutation createCart($cartInput: CartInput!) {
    cartCreate(input: $cartInput) {
      cart {
        id
        checkoutUrl
      }
    }
  }
`;
