import styles from './PostPreview.module.scss';

export function PostPreview() {

    function handlePost() {
        console.log('clicou');
    }

    return (
        <div onClick={handlePost} className={styles.container}>
            <div className={styles.title}>
                <h1>Criando um app CRA do zero</h1>
                <p>Tudo sobre como criar a sua primeria aplicação utilizando Create React App</p>
            </div>
            <div className={styles.info}>
                <h5>
                    <img src="/images/calendar.svg" alt="calendário" />
                    15 Mar 2021
                </h5>
                <h5>
                    <img src="/images/user.svg" alt="usuário" />
                    Mufinha
                </h5>
            </div>
        </div>
    );
}