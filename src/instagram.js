/* eslint-disable camelcase */
const axios = require(`axios`)

export async function getInstagramPosts({
  access_token,
  customer_username,
  instagram_id,
}) {
  return axios.get(
      `https://graph.facebook.com/${instagram_id}?fields=business_discovery.username(${customer_username}){media{media_url}}&access_token=${access_token}`
    )
    .then((response) => response.data.business_discovery.media.data)
    .catch((err) => {
      console.warn(
        `\nCould not get instagram posts using the Graph API. Error status ${err}`
      )
    })
}
