/* eslint-disable camelcase */
const axios = require(`axios`)

export async function getInstagramPosts({
  access_token,
  customer_username,
  instagram_id,
}) {
  // original endpoint
  // `https://graph.facebook.com/${instagram_id}?fields=business_discovery.username(${customer_username}){media{media_url}}&access_token=${access_token}`

  try {
    const res = await axios.get(
      `https://graph.facebook.com/${instagram_id}?fields=business_discovery.username(${customer_username}){media{media_url, media_type, owner, permalink, media_product_type, children{media_url, media_type}}}&access_token=${access_token}`
    )

    return res.data.business_discovery.media.data
  } catch (err) {
    return err
  }
}
