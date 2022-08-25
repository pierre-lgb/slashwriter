import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import { withPageAuth } from 'src/utils/supabase'

import DeleteOutlined from '@mui/icons-material/DeleteOutlined'

function Trash() {
    return <TransitionOpacity></TransitionOpacity>
}

Trash.Layout = AppLayout
Trash.Title = "Corbeille"
Trash.Icon = <DeleteOutlined />

export const getServerSideProps = withPageAuth()

export default Trash
