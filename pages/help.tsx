import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import { withPageAuth } from 'src/utils/supabase'

import HelpOutlineOutlined from '@mui/icons-material/HelpOutlineOutlined'

export default function Help() {
    return <TransitionOpacity></TransitionOpacity>
}

Help.Layout = AppLayout
Help.Title = "Aide"
Help.Icon = <HelpOutlineOutlined />

export const getServerSideProps = withPageAuth()
