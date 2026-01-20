
export const getAccessToken = async () => {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

    if (!consumerKey || !consumerSecret) {
        throw new Error("Missing M-Pesa credentials");
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errorMessage || "Failed to get access token");
        }

        return data.access_token;
    } catch (error) {
        console.error("M-Pesa Token Error:", error);
        throw error;
    }
};

export const generatePassword = () => {
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;

    if (!shortcode || !passkey) {
        throw new Error("Missing M-Pesa Shortcode or Passkey");
    }

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    return { password, timestamp };
};
