import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import { withPageAuth } from 'src/utils/supabase'

import StarBorderOutlined from '@mui/icons-material/StarBorderOutlined'

function Favorites() {
    return <TransitionOpacity></TransitionOpacity>
}

Favorites.Layout = AppLayout
Favorites.Title = "Favoris"
Favorites.Icon = <StarBorderOutlined />

export const getServerSideProps = withPageAuth()

export default Favorites
