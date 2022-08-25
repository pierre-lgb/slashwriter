import Image from 'next/image'
import Flex from 'src/components/Flex'
import AccountMenu from 'src/components/menus/AccountMenu'
import styled from 'styled-components'

import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined'
import { User } from '@supabase/supabase-js'

interface AccountSectionProps {
    user: User
}

export default function AccountSection({ user }: AccountSectionProps) {
    return (
        <AccountMenu>
            <Container align="center" gap={10}>
                <Avatar
                    src="https://ui-avatars.com/api/?name=/"
                    width={25}
                    height={25}
                />
                <StyledEmail>{user?.email}</StyledEmail>
                <ExpandIcon />
            </Container>
        </AccountMenu>
    )
}

const Container = styled(Flex)`
    height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid var(--color-n300);
    &:hover {
        cursor: pointer;
        background-color: var(--color-n100);
    }
`

const Avatar = styled(Image)`
    border-radius: 50%;
`

const StyledEmail = styled.span`
    font-size: 0.9em;
    color: var(--color-n700);
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const ExpandIcon = styled(ExpandMoreOutlined)`
    color: var(--color-n700);
    font-size: 1.2em;
`
