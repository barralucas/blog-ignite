import { GetStaticProps } from 'next';
import Header from '../components/Header';
import { PostPreview } from '../components/PostPreview';
import styles from './home.module.scss';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

// import commonStyles from '../styles/common.module.scss';
// import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  return (
    <div className={styles.container}>
      <Header />


      {postsPagination.results.map(post => (
        <PostPreview title={post.data.title} subtitle={post.data.subtitle} author={post.data.author} date={post.first_publication_date} />
      ))}


    </div>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts')
  ], {
    fetch: [
      'posts.title',
      'posts.subtitle',
      'posts.author'
    ],
    pageSize: 10,
  });

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        Date.parse(post.first_publication_date),
        "dd MMM y",
        {
          locale: ptBR,
        }
      ),
      data: {
        title: RichText.asText(post.data.title),
        subtitle: RichText.asText(post.data.subtitle),
        author: RichText.asText(post.data.author),
      }
    }
  })

  const postsPagination = {
    next_page: 'string',
    results
  }

  return {
    props: {
      postsPagination
    }
  }
};
