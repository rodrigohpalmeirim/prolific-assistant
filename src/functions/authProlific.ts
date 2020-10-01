export async function authProlific() {
  const response = await fetch('https://www.prolific.co/openid/authorize?client_id=447610&redirect_uri=https://app.prolific.co/oauth/callback&scope=openid%20profile&response_type=id_token%20token&state=state&nonce=nonce');
  console.log(response)
}
