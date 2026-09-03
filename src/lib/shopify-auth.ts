import { shopifyFetch } from './shopify';

/**
 * Creates a customer access token (login).
 */
export async function loginCustomer(email: string, password: string) {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      email,
      password,
    }
  };

  const response = await shopifyFetch({ query, variables });
  const data = response.body?.data?.customerAccessTokenCreate;

  if (data?.customerUserErrors?.length > 0) {
    throw new Error(data.customerUserErrors[0].message);
  }

  return data?.customerAccessToken;
}

/**
 * Registers a new customer.
 */
export async function registerCustomer(email: string, password: string, firstName?: string, lastName?: string, phone?: string) {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const input: any = {
    email,
    password,
  };

  if (firstName) input.firstName = firstName;
  if (lastName) input.lastName = lastName;
  if (phone) input.phone = phone;

  const variables = { input };

  const response = await shopifyFetch({ query, variables });
  const data = response.body?.data?.customerCreate;

  if (data?.customerUserErrors?.length > 0) {
    throw new Error(data.customerUserErrors[0].message);
  }

  // After registration, log them in automatically to get the token
  return loginCustomer(email, password);
}

/**
 * Fetches customer details and order history.
 */
export async function getCustomer(accessToken: string) {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
        phone
        orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      image {
                        url
                      }
                      product {
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { customerAccessToken: accessToken };

  const response = await shopifyFetch({ query, variables });
  return response.body?.data?.customer;
}
