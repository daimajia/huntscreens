import { Producthunt } from '@/db/schema/ph';
import assert from 'assert';
import axios from 'axios';

export type PHPost = {
  cursor: string,
  node: Producthunt
}
export async function fetchPHPosts() : Promise<PHPost[]> {
  const PH_ACCESS_TOKEN = process.env.PH_ACCESS_TOKEN;
  assert(PH_ACCESS_TOKEN);
  const config = {
    headers: {
      Authorization: `Bearer ${PH_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  const body = {
    query: `
    {
      posts( first: 50, featured: true){
        edges{
          cursor
          node {
            id
            url
            name
            tagline
            description
            slug
            votesCount
            website
            thumbnail {
              type
              url
            }
            productLinks {
              type
              url
            }
            topics {
              nodes {
                name
              }
            }
            createdAt
            featuredAt
          }
        } 
      }
  }
  
  `,
  };

  const {
    data: {
      data: {
        posts: { edges },
      },
    },
  } = await axios.post('https://api.producthunt.com/v2/api/graphql', body, config);

  return edges;
}