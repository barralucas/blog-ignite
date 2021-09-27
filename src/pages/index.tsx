import { GetStaticProps } from 'next';
import Header from '../components/Header';
import { PostPreview } from '../components/PostPreview';
import styles from './home.module.scss';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

// import commonStyles from '../styles/common.module.scss';

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
  next_page: string | null;
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
        <PostPreview
          slug={post.uid}
          title={post.data.title}
          subtitle={post.data.subtitle}
          author={post.data.author}
          date={post.first_publication_date}
        />
      ))}

      {!!postsPagination.next_page && (
        <button>Carregar mais posts</button>
      )}

    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts')
  ], {
    fetch: [
      'posts.title',
      'posts.subtitle',
      'posts.author'
    ],
  });

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  })

  const postsPagination = {
    next_page: postsResponse.next_page,
    results
  }

  return {
    props: {
      postsPagination
    }
  }
};
