import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import Image from 'next/image';

import { getPrismicClient } from '../../services/prismic';

// import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Header from '../../components/Header';
import { Markup } from 'interweave';

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
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className={styles.container}>
        <Header />
        <h2 className={styles.loading}>Carregando...</h2>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <Header />
        <div>
          <Image src={String(post.data.banner)} alt="banner" width={720} height={400} layout="responsive" />

          <div className={styles.content}>
          <Markup content={`<h1>${RichText.asHtml(post.data.title)}</h1>`} />
          <Markup content={String(post.data.content[0].body[0])} />
          <Markup content={post.data.content[1].heading} />
          <Markup content={String(post.data.content[1].body[0])} />
          </div>

        </div>
      </div>
    );
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
  );

  return {
    paths: [
      {
        params: {
          slug: posts.results[0].slugs[0]
        }
      },
    ],
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async (context) => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(context.params.slug), {});

  const post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: response.data.banner.url,
      author: RichText.asText(response.data.author),
      content: [
        {
          heading: RichText.asHtml(response.data.content[0]?.heading),
          body: [
            RichText.asHtml(response.data.content[0]?.body)
          ]
        },
        {
          heading: RichText.asHtml(response.data.content[1]?.heading),
          body: [
            RichText.asHtml(response.data.content[1]?.body)
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
