<div align="center">
<h1>isaacp-gatsby-source-instagram</h1>

[![npm version](https://badge.fury.io/js/gatsby-source-instagram.svg)](https://badge.fury.io/js/gatsby-source-instagram)
![npm](https://img.shields.io/npm/dw/gatsby-source-instagram.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Average time to resolve an issue](https://isitmaintained.com/badge/resolution/oorestisime/gatsby-source-instagram.svg)](https://isitmaintained.com/project/oorestisime/gatsby-source-instagram "Average time to resolve an issue")
![NPM](https://img.shields.io/npm/l/gatsby-source-instagram.svg)
[![Netlify Status](https://api.netlify.com/api/v1/badges/c2fe26e3-7ba1-47a8-a399-17a02a301658/deploy-status)](https://app.netlify.com/sites/gatsby-src-instagram/deploys)

</div>

This is a fork from the gatsby-source-instagram plugin. There are four ways to get information from instagram, but this fork only focuses on the graph API.  If you want to see the other options then check out the [original repo](https://github.com/oorestisime/gatsby-source-instagram)

# Table of Contents

- [Install](#install)
- [How to use](#how-to-use)
  - [Public scraping for posts](#public-scraping-for-posts)
  - [Public scraping for a user's profile](#public-scraping-for-a-users-profile)
  - [Graph API](#graph-api)
  - [Hashtag scraping](#hashtag-scraping)
- [How to query](#how-to-query)
  - [Posts](#posts)
  - [User profile information](#user-profile-information)
- [Image processing](#image-processing)
- [Instagram Graph API token](#instagram-graph-api-token)

## Install

`npm i isaacp-gatsby-source-instagram`

## How to use

### Graph API

If you intend to use the Instagram Graph Api then you need to pass the instagram id and an access token

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `isaacp-gatsby-source-instagram`,
    options: {
      username: `username`,
      access_token: "a valid access token",
      instagram_id: "your instagram_business_account id",
      paginate: 100,
      maxPosts: 1000,
      hashtags: true
    },
  },
]
```

Passing the username in this case is optional. If the Graph Api throws any exception and the username is provided then it will use the public scraping method as a fallback.

The `paginate` parameter will influence the limit set for the api call (defaults to 100) and the `maxPosts` enables to limit the maximum number of posts we will store. Defaults to undefined.

The `hashtag` parameter can be set to true which will also grab the hashtags from the first 3 comments by default. If you'd like to change the number of comments to check for hashtags you can pass an object like below. Defaults to false.

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-source-instagram`,
    options: {
      username: `username`,
      access_token: "a valid access token",
      instagram_id: "your instagram_business_account id",
      hashtags: {
        enabled: true,
        commentDepth: 10
      }
    },
  },
]

```

## How to query

### Posts

The plugin tries to provide uniform results regardless of the way you choose to retrieve the information

Common fields include:

- id
- likes
- original
- timestamp
- comments
- caption
- username (fallbacks to the hashtag name in case of hashtag scraping)
- preview
- mediaType
- permalink
- carouselImages

The public scraping method can additionaly retrieve:

- thumbnails
- dimensions

```graphql
query {
  allInstaNode {
    edges {
      node {
        id
        likes
        comments
        mediaType
        preview
        original
        timestamp
        caption
        hashtags
        localFile {
          childImageSharp {
            fixed(width: 150, height: 150) {
              ...GatsbyImageSharpFixed
            }
          }
        },
        permalink,
        carouselImages {
          preview,
          localFile {
          childImageSharp {
            fixed(width: 150, height: 150) {
              ...GatsbyImageSharpFixed
            }
          }
        },
        # Only available with the public api scraper
        thumbnails {
          src
          config_width
          config_height
        }
        dimensions {
          height
          width
        }
      }
    }
  }
}
```

## Image processing

To use image processing you need gatsby-transformer-sharp, gatsby-plugin-sharp and their dependencies gatsby-image and gatsby-source-filesystem in your gatsby-config.js.

You can apply image processing on each instagram node. To access image processing in your queries you need to use the localFile on the **InstaNode** as shown above:

## Instagram Graph API token

** Disclaimer: ** These steps might not be clear, or not exactly working for everybody. Working on updated or automated steps right now. Progress is at https://github.com/oorestisime/gatsby-source-instagram/issues/24
Any help on this side is greatly welcomed and appreciated!

1. You need to have a Facebook page (I know... :/)
1. Go to your site settings -> Instagram -> Login into your Instagram account
1. Create a [app](https://developers.facebook.com/apps/)
1. Go to the [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
   1. We will be using v13.0 
   1. Select your facebook app
   1. Click "Generate Access Token"
   1. Add the following permissions (pages_manage_ads, pages_manage_metadata, pages_read_engagement, pages_read_user_content, pages_show_list, instagram_basic)
   1. Make a GET request at `me/accounts`
   1. Under the data array, look for the page you created in facebook and copy the access_token.  We will call this the **temporary_token**
   1. click on the id to change the explorer url and append `?fields=instagram_business_account`
   1. save your `instagram_business_account.id`, this is your **instagram_id**
1. [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/):
   1. Paste your temporary_token and press "Debug"
   1. You should see this token now expires in 3 months
   1. Press "Extend Access Token" and press the new debug that appears next to the token
   1. This token is suppose to never expire but it will most likely expire in 3 months
   1. Copy this new token (we will call this **access_token**)

With these two information you can use this snippet inside of your gatsby-config.js file:

```
{
  resolve: `gatsby-source-instagram`,
  options: {
    customer_username: process.env.INSTAGRAM_CUSTOMER_USERNAME,
    access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
    instagram_id: process.env.INSTAGRAM_ID,
    facebook_api_version: process.env.FACEBOOK_API_VERSION,
  },
},
```

You will need the following ENV variables and the `.env.development` file in your project root:

NOTE:  If you are using your own instagram account then use the credentials we got earlier.  However, if you are a developer who is using this for a client's account then you must use their credentials to fill out the .env file below (everything except for INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_ID).

```
INSTAGRAM_ACCESS_TOKEN= The access_token we got earlier 
INSTAGRAM_CUSTOMER_ID= client id
INSTAGRAM_CUSTOMER_USERNAME= client username
INSTAGRAM_ID= The instagram_id we got earlier
FACEBOOK_API_VERSION=v13.0
``` 


---

## Common Build Errors

### Cannot query field "allInstaNode" on type "Query" or Instagram API returned login page

This error is typically caused by Instagram rate limiting calls to its API by returning a login screen. You can use the [Graph API](#instagram-graph-api-token) to avoid this error.

If you are hosting on Netlify you may see this error appear more often when trying to build as it seems Netlify's servers get rate limited more frequently.
