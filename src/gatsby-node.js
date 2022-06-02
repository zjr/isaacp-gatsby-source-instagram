const _ = require(`lodash`)

const { getInstagramPosts } = require(`./instagram`)

const defaultOptions = {
  type: `account`,
  paginate: 100,
  hashtags: false,
}

// constants for your GraphQL Post types
const POST_NODE_TYPE = `InstagramPost`

exports.sourceNodes = async (
  { actions, createContentDigest, createNodeId, getNodesByType },
  options
) => {
  const { createNode } = actions
  const params = { ...defaultOptions, ...options }

  const data = await getInstagramPosts(params)

  // loop through data and create Gatsby nodes
  data.forEach((post) =>
    createNode({
      ...post,
      id: createNodeId(`${POST_NODE_TYPE}-${post.id}`),
      parent: null,
      children: [],
      internal: {
        type: POST_NODE_TYPE,
        content: JSON.stringify(post),
        contentDigest: createContentDigest(post),
      },
    })
  )

  return
}
