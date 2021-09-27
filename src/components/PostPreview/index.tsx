import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
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
                        <h1>{RichText.asText(title)}</h1>
                        <p>{RichText.asText(subtitle)}</p>
                    </div>
                    <div className={styles.info}>
                        <h5>
                            <img src="/images/calendar.svg" alt="calendário" />
                            {format(
                                Date.parse(date),
                                "dd MMM y",
                                {
                                    locale: ptBR,
                                }
                            )}
                        </h5>
                        <h5>
                            <img src="/images/user.svg" alt="usuário" />
                            {RichText.asText(author)}
                        </h5>
                    </div>
                </a>
            </Link>
        </div>
    );
}