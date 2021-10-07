import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import Image from 'next/image';

import { getPrismicClient } from '../../services/prismic';

// import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Header from '../../components/Header';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { Head } from 'next/document';

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
    return <h2 className={styles.loading}>Carregando...</h2>;
  }



  return (
    <div className={styles.container}>
      <Head>
        <title>{post.data.title} | space traveling</title>
      </Head>

      <Header />

      <div>

        <Image src={String(post.data.banner)} alt="banner" width={720} height={400} layout="intrinsic" />

        <div className={styles.content}>

          <div className="post-info">
            <h5>
              <img src="/images/calendar.svg" alt="calendário" />
              {post.first_publication_date}
            </h5>
            <h5>
              <img src="/images/user.svg" alt="usuário" />
              {post.data.author}
            </h5>
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

      </div>
    </div>
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
  params: { slug },
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {
    ref: previewData?.ref ?? null,
  });

  if (!response) {
    return {
      notFound: true,
    };
  }

  // const prevPost = (
  //   await prismic.query(Prismic.predicates.at('document.type', 'post'), {
  //     pageSize: 1,
  //     after: response.id,
  //     orderings: '[document.first_publication_date desc]',
  //     fetch: ['post.title'],
  //   })
  // ).results[0];

  // const nextPost = (
  //   await prismic.query(Prismic.predicates.at('document.type', 'post'), {
  //     pageSize: 1,
  //     after: response.id,
  //     orderings: '[document.first_publication_date]',
  //     fetch: ['post.title'],
  //   })
  // ).results[0];

  const post = {
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    uid: response.uid,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
      // preview,
      // prevPost: prevPost ?? null,
      // nextPost: nextPost ?? null,
    },
    revalidate: 60 * 60 * 24, // 24 Horas
  };
};