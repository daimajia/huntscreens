import { Producthunt } from '@/db/schema/ph';
import assert from 'assert';
import axios from 'axios';

export type PHPost = {
  cursor: string,
  node: Producthunt
}

export type PostVoteData = {
  votesCount: number,
  commentsCount: number
}

const phrequest = async (body: string) => {
  const PH_ACCESS_TOKEN = process.env.PH_ACCESS_TOKEN;
  assert(PH_ACCESS_TOKEN);
  const config = {
    headers: {
      Authorization: `Bearer ${PH_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  const requestBody = {
    query: `${body}`
  };
  const {data: {data: data}} = await axios.post('https://api.producthunt.com/v2/api/graphql', requestBody, config);
  return data;
}

export async function fetchVoteCount(id: number) : Promise<PostVoteData> {
  const {post: ret} = await phrequest(`
    {
      post( id:${id}){
          votesCount,
          commentsCount
        }
    }
  `)
  return ret;
}

export async function fetchPHPosts() : Promise<PHPost[]> {
  const body = `
    {
      posts( first: 20, featured: true){
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
  }`;
  const {posts: {edges}} = await phrequest(body);
  return edges;
}