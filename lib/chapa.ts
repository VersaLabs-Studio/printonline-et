export interface ChapaInitializeOptions {
  amount: string;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  tx_ref: string;
  callback_url?: string;
  return_url?: string;
  customization?: {
    title?: string;
    description?: string;
    logo?: string;
  };
}

export interface ChapaInitializeResponse {
  message: string;
  status: string;
  data: {
    checkout_url: string;
  };
}

export interface ChapaVerifyResponse {
  message: string;
  status: string;
  data: {
    first_name: string;
    last_name: string;
    email: string;
    currency: string;
    amount: number;
    charge: number;
    mode: string;
    method: string;
    type: string;
    status: string;
    reference: string;
    tx_ref: string;
    customization: {
      title: string;
      description: string;
      logo: string | null;
    };
    meta: Record<string, unknown>;
    created_at: string;
    updated_at: string;
  };
}

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;
const CHAPA_BASE_URL = process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1";

export const chapa = {
  /**
   * Initializes a transaction with Chapa
   */
  async initialize(options: ChapaInitializeOptions): Promise<ChapaInitializeResponse> {
    if (!CHAPA_SECRET_KEY) {
      throw new Error("CHAPA_SECRET_KEY is not defined in environment variables");
    }

    const response = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Chapa Initialization Error:", data);
      throw new Error(data.message || "Failed to initialize Chapa transaction");
    }

    return data;
  },

  /**
   * Verifies a transaction with Chapa
   */
  async verify(tx_ref: string): Promise<ChapaVerifyResponse> {
    if (!CHAPA_SECRET_KEY) {
      throw new Error("CHAPA_SECRET_KEY is not defined in environment variables");
    }

    const response = await fetch(`${CHAPA_BASE_URL}/transaction/verify/${tx_ref}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Chapa Verification Error:", data);
      throw new Error(data.message || "Failed to verify Chapa transaction");
    }

    return data;
  },
};
