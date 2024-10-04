const clientId = "746e3bd9-0abf-4f9e-852a-35ae94aebe77";
const clientSecret = "c09578f5-ca64-44c9-bd21-c15ca9e991d6";
// const redirectUri = "your-redirect-uri";

export const requestAccessToken = async (
  authorizationCode: string
): Promise<{ accessToken: string; userId: string } | null> => {
  // const clientId = 'your-client-id';
  // const clientSecret = 'your-client-secret';
  // const authorizationCode = 'your-authorization-code';
  // const redirectUri = "http://localhost:3000/polar";
  const tokenEndpoint = "https://polarremote.com/v2/oauth2/token";

  // Encode client_id:client_secret to Base64
  const base64Credentials = btoa(`${clientId}:${clientSecret}`);

  try {
    // Prepare request headers
    const headers = {
      Authorization: `Basic ${base64Credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json;charset=UTF-8",
    };

    // Prepare request body
    const requestBody = new URLSearchParams({
      grant_type: "authorization_code",
      code: authorizationCode,
      // redirect_uri: redirectUri,
    });

    console.log(requestBody);

    // Make the POST request using fetch
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: headers,
      body: requestBody.toString(),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();
    return { accessToken: data.access_token, userId: data.x_user_id };
  } catch (error) {
    console.error("Error requesting access token:", error);
    return null;
  }
};
