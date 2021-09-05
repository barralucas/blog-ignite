import styles from './PostPreview.module.scss';

interface PostPreviewProps {
    title: string;
    subtitle: string;
    author: string;
    date: string;
}

export function PostPreview({ title, subtitle, author, date }: PostPreviewProps) {

    function handlePost() {
        console.log('clicou');
    }

    return (
        <div onClick={handlePost} className={styles.container}>
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
        </div>
    );
}