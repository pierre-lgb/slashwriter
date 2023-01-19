import Image from "next/legacy/image"
import { RiArrowDownSLine as ExpandIcon } from "react-icons/ri"
import Flex from "src/components/Flex"
import AccountMenu from "src/components/menus/AccountMenu"
import styled from "styled-components"

import { User } from "@supabase/supabase-js"

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
                <StyledEmail>{user?.email || "Non connecté"}</StyledEmail>
                <ExpandIcon color="var(--color-n700)" fontSize="1.2rem" />
            </Container>
        </AccountMenu>
    )
}

const Container = styled(Flex)`
    height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid var(--color-n300);
    flex-shrink: 0;

    &:hover {
        cursor: pointer;
        background-color: var(--color-n100);
    }
`

const Avatar = styled.img`
    border-radius: 50%;
`

const StyledEmail = styled.span`
    font-size: 0.85em;
    font-weight: 500;
    color: var(--color-n600);
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
