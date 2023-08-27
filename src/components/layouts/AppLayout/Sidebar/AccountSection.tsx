import { RiArrowDownSLine as ExpandIcon } from "react-icons/ri"
import AccountMenu from "src/components/menus/AccountMenu"
import Flex from "src/components/ui/Flex"

// import styled from "styled-components"
import { User } from "@supabase/supabase-js"

import styles from "./AccountSection.module.scss"

interface AccountSectionProps {
    user?: User
}

export default function AccountSection(props: AccountSectionProps) {
    const { user } = props

    return (
        <AccountMenu>
            <div className={styles.accountSection}>
                <img
                    className={styles.avatar}
                    src="https://ui-avatars.com/api/?name=/"
                    width={25}
                    height={25}
                />
                <span className={styles.email}>
                    {user?.email || "Non connecté"}
                </span>
                <ExpandIcon color="var(--color-n700)" fontSize="1.2rem" />
            </div>
        </AccountMenu>
    )
}
