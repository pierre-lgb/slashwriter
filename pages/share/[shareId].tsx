import Head from 'next/head'
import TransitionOpacity from 'src/components/TransitionOpacity'
import styles from 'src/styles/Share.module.css'

function Share() {
    return (
        <TransitionOpacity>
            <div className={styles.container}>
                <main className={styles.main}>Document partagé</main>
            </div>
        </TransitionOpacity>
    )
}

Share.Title = "Document partagé"

export default Share
