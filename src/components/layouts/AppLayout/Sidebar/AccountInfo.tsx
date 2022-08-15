import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-toward.css'

import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined'

import AccountMenu from '../../../menus/AccountMenu'
import styles from './AccountInfo.module.css'

function AccountInfo({ user }) {
    return (
        <AccountMenu>
            <div className={styles.container}>
                <div>
                    {user?.photoURL ? (
                        <div></div>
                    ) : (
                        <div className={styles.defaultAvatar}></div>
                    )}
                </div>
                <div style={{ marginLeft: 16 }}>
                    <div className={styles.username}>
                        {user?.email.split("@")[0]}
                    </div>
                    <div className={styles.email}>{user?.email}</div>
                </div>

                <div className={styles.expandIcon}>
                    <ExpandMoreOutlined />
                </div>
            </div>
        </AccountMenu>
    )
}

export default AccountInfo
