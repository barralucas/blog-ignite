import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';

import { ptBR } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

import { Comments } from '../../components/Comments';

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
  nextPost: {
    uid: string;
    data: {
      title: string;
    }
  };
  prevPost: {
    uid: string;
    data: {
      title: string;
    }
  };
}

export default function Post({ post, nextPost, prevPost }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h2 className={styles.loading}>Carregando...</h2>;
  }

  const readingTime = post.data.content.reduce((acc, content) => {
    const textBody = RichText.asText(content.body);
    const split = textBody.split(' ');
    const numberWords = split.length;

    const result = Math.ceil(numberWords / 200);
    return acc + result;
  }, 0);

  return (
    <>
      <Head>
        <title>{post.data.title}</title>
      </Head>

      <section className={styles.banner}>
        <img src={post.data.banner.url} alt={post.data.title} />
      </section>

      <main className={styles.container}>
        <div className={styles.postContent}>
          <h1>{post.data.title}</h1>
          <div className={styles.postInfo}>
            <time>
              <FiCalendar />{' '}
              {format(parseISO(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </time>
            <p>
              <FiUser /> {post.data.author}
            </p>
            <time>
              <FiClock /> {readingTime} min
            </time>
          </div>

          <section>
            {post.data.content.map(item => (
              <section key={item.heading}>
                <h2>{item.heading}</h2>
                <article
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(item.body),
                  }}
                />
              </section>
            ))}
          </section>
        </div>
      </main>

      <Comments />
      <footer className={styles.navigationPosts}>
        {prevPost && (
          <Link href={`/post/${prevPost.uid}`}>
            <div>
              <h2>{prevPost.data.title}</h2>
              <strong>Post anterior</strong>
            </div>
          </Link>
        )}
        {nextPost && (
          <Link href={`/post/${nextPost.uid}`}>
            <div>
              <h2>{nextPost.data.title}</h2>
              <strong>Próximo post</strong>
            </div>
          </Link>
        )}
      </footer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'post'),
  ]);

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params: { slug }
}) => {
  const prismic = getPrismicClient();
  const post = await prismic.getByUID('posts1', String(slug), {});

  const nextPost = (
    await prismic.query(Prismic.predicates.at('document.type', 'posts1'), {
      pageSize: 1,
      after: `${post.id}`,
      orderings: '[document.first_publication_date desc]',
      fetch: ['post.uid', 'post.title'],
    })
  ).results[0];

  const prevPost = (
    await prismic.query(Prismic.predicates.at('document.type', 'posts1'), {
      pageSize: 1,
      after: `${post.id}`,
      orderings: '[document.first_publication_date]',
      fetch: ['post.uid', 'post.title'],
    })
  ).results[0];

  if (!nextPost) {
    return {
      props: {
        post,
        prevPost
      },
      revalidate: 60 * 60 * 24, // 24 Horas
    };
  }

  if (!prevPost) {
    return {
      props: {
        post,
        nextPost
      },
      revalidate: 60 * 60 * 24, // 24 Horas
    };
  }

  return {
    props: {
      post,
      nextPost,
      prevPost
    },
    revalidate: 60 * 60 * 24, // 24 Horas
  };
};