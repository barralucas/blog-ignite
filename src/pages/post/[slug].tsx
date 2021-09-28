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
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

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

  return (
    <h1>teste</h1>
    //   <div className={styles.container}>
    //     <Header />

    //     {router.isFallback ? (

    //       <h2 className={styles.loading}>Carregando...</h2>

    //     ) : (

    //       <div>

    //         <Image src={String(post.data.banner)} alt="banner" width={720} height={400} layout="intrinsic" />

    //         <div className={styles.content}>
    //           <Markup content={`<h1>${RichText.asText(post.data.title)}</h1>`} />

    //           <div className="post-info">
    //             <h5>
    //               <img src="/images/calendar.svg" alt="calendário" />
    //               {post.first_publication_date}
    //             </h5>
    //             <h5>
    //               <img src="/images/user.svg" alt="usuário" />
    //               {RichText.asText(post.data.author)}
    //             </h5>
    //           </div>

    //           <Markup content={RichText.asHtml(post.data.content[0].body[0])} />
    //           <Markup content={RichText.asHtml(post.data.content[1].heading)} />
    //           <Markup content={RichText.asHtml(post.data.content[1].body[0])} />
    //         </div>

    //       </div>
    //     )}
    //   </div>
  );
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

  // const post = {
  //   first_publication_date: format(
  //     Date.parse(response.first_publication_date),
  //     "dd MMM y",
  //     {
  //       locale: ptBR,
  //     }
  //   ),
  //   data: {
  //     title: response.data.title,
  //     banner: response.data.banner.url,
  //     author: response.data.author,
  //     content: [
  //       {
  //         heading: response.data.content[0]?.heading,
  //         body: [
  //           response.data.content[0]?.body
  //         ]
  //       },
  //       {
  //         heading: response.data.content[1]?.heading,
  //         body: [
  //           response.data.content[1]?.body
  //         ]
  //       }
  //     ]
  //   }
  // }

  return {
    props: {
      post: response
    },
    revalidate: 60 * 60 * 24, // 24 hours   
  }
};
