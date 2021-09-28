import Link from 'next/link';
import styles from './PostPreview.module.scss';

interface PostPreviewProps {
    title: string;
    subtitle: string;
    author: string;
    date: string;
    slug: string;
}

export function PostPreview({ title, subtitle, author, date, slug }: PostPreviewProps) {

    return (
        <div className={styles.container}>
            <Link href={`/post/${slug}`}>
                <a>
                    <div className={styles.title}>
                        <h1>{title}</h1>
                        <p>{subtitle}</p>
                    </div>
                    <div className={styles.info}>
                        <h5>
                            <img src="/images/calendar.svg" alt="calendário" />
                            {date}
                        </h5>
                        <h5>
                            <img src="/images/user.svg" alt="usuário" />
                            {author}
                        </h5>
                    </div>
                </a>
            </Link>
        </div>
    );
}