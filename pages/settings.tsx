import AppLayout from 'src/components/layouts/AppLayout'
import TransitionOpacity from 'src/components/TransitionOpacity'
import { withPageAuth } from 'src/utils/supabase'

import TuneOutlined from '@mui/icons-material/TuneOutlined'

function Settings() {
    return <TransitionOpacity></TransitionOpacity>
}

Settings.Layout = AppLayout
Settings.Title = "Paramètres"
Settings.Icon = <TuneOutlined />

export const getServerSideProps = withPageAuth()

export default Settings
