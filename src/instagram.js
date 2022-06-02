/* eslint-disable camelcase */
const axios = require(`axios`)

export async function apiInstagramPosts({
  access_token,
  customer_username,
  instagram_id,
}) {
  return axios
    .get(
      `https://graph.facebook.com/${instagram_id}?fields=business_discovery.username(${customer_username}){media{media_url}}&access_token=${access_token}`
    )
    .then(async (response) => {
      const results = []
      results.push(...response.data.business_discovery.media.data)

      return results
    })
    .catch(async (err) => {
      console.warn(
        `\nCould not get instagram posts using the Graph API. Error status ${err}`
      )

      return null
    })
}
