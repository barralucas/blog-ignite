import { GetStaticProps } from 'next';
import Header from '../components/Header';
import { PostPreview } from '../components/PostPreview';
import styles from './home.module.scss';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';

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
  const [allPosts, setAllPosts] = useState(postsPagination.results);
  const [nextPage, setNextPost] = useState(postsPagination.next_page);

  async function handleLoadMorePosts() {
    const response = await (await fetch(nextPage)).json();

    setAllPosts([...allPosts, ...response.results])

    setNextPost(response.next_page);
  }

  return (
    <div className={styles.container}>
      <Header />

      {allPosts.map((post: Post) => (
        <PostPreview
          key={post.uid}
          slug={post.uid}
          title={post.data.title}
          subtitle={post.data.subtitle}
          author={post.data.author}
          date={format(
            Date.parse(post.first_publication_date),
            "dd MMM y",
            {
              locale: ptBR,
            }
          )}
        />
      ))}

      {nextPage && (
        <button onClick={handleLoadMorePosts}>Carregar mais posts</button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts1')
  ], {
    fetch: [
      'posts1.title',
      'posts1.subtitle',
      'posts1.author'
    ],
    pageSize: 1,
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results
  }

  return {
    props: {
      postsPagination
    }
  }
};
