import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { useEffect } from 'react';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  console.log(post);
  return (
    <h1 style={{ color: 'white' }}>POST</h1>
  )
}

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: 'blocking'
  }
};

export const getStaticProps: GetStaticProps = async (context) => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', context.params.slug.toString(), {});

  const post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: RichText.asText(response.data.title),
      banner: response.data.banner.url,
      author: RichText.asText(response.data.author),
      content: [
        {
          heading: response.data.content[0].heading, body: [
            response.data.content[0].body
          ]
        },
        {
          heading: response.data.content[1].heading, body: [
            response.data.content[1].body
          ]
        }
      ]
    }
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }

};
