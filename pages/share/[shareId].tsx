import Head from 'next/head'
import TransitionOpacity from 'src/components/TransitionOpacity'

function Share() {
    return (
        <TransitionOpacity>
            <div>Document partagé</div>
        </TransitionOpacity>
    )
}

Share.Title = "Document partagé"

export default Share
