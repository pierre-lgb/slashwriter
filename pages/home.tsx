import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import { withPageAuth } from 'src/utils/supabase'

import HomeOutlined from '@mui/icons-material/HomeOutlined'

export default function Home() {
    return <TransitionOpacity></TransitionOpacity>
}

Home.Layout = AppLayout
Home.Title = "Accueil"
Home.Icon = <HomeOutlined />

export const getServerSideProps = withPageAuth()
