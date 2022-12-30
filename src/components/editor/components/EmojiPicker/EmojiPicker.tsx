import { Ref, useState } from "react"
import { RiSearchLine as SearchIcon } from "react-icons/ri"
import Twemoji from "react-twemoji"
import Input from "src/components/ui/Input"
import styled from "styled-components"

import emojis, { unicode_to_shortcode } from "./emojis"

interface EmojiPickerProps {
    /**
     * Called when an emoji is selected
     *
     * @param emoji
     * @returns
     */
    onSelectEmoji?: (emoji: string) => any
    /**
     * Reference of the emoji search input
     */
    searchInputRef?: Ref<HTMLInputElement>

    [x: string]: any
}

type Emojis = {
    [x: string]: {
        unicode: string
        tags: string[]
        [x: string]: any
    }[]
}

function filterEmojis(emojis: Emojis, query: string) {
    const filteredEmojis: Emojis = {}

    Object.entries(emojis).forEach(([groupName, groupEmojis]) => {
        filteredEmojis[groupName] = groupEmojis.filter(
            (emoji) =>
                query.includes(emoji.unicode) ||
                emoji.tags.some((tag: string) =>
                    tag.startsWith(query.toLowerCase())
                ) ||
                emoji.shortcode.startsWith(query.toLowerCase()) ||
                emoji.shortcode
                    .replace("_", " ")
                    .startsWith(query.toLowerCase())
        )
    })
    return filteredEmojis
}

export default function EmojiPicker(props: EmojiPickerProps) {
    const { onSelectEmoji, searchInputRef, pickerRef, ...otherProps } = props
    const [query, setQuery] = useState("")

    return (
        <Container ref={pickerRef} {...otherProps}>
            <Input
                inputRef={searchInputRef}
                icon={<SearchIcon />}
                placeholder="Rechercher..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />
            <Twemoji options={{ className: "emoji" }}>
                {Object.entries(filterEmojis(emojis["fr"], query)).map(
                    ([groupName, groupEmojis], index) =>
                        groupEmojis.length ? (
                            <Group key={index}>
                                <GroupTitle>{groupName}</GroupTitle>
                                <GroupContent>
                                    {groupEmojis.map((emoji, index) => (
                                        <EmojiButton
                                            onClick={() => {
                                                onSelectEmoji?.(emoji.unicode)
                                            }}
                                            key={index}
                                        >
                                            {emoji.unicode}
                                        </EmojiButton>
                                    ))}
                                </GroupContent>
                            </Group>
                        ) : null
                )}
            </Twemoji>
        </Container>
    )
}

const Container = styled.div`
    padding: 0.5rem;
    max-height: 300px;
    max-width: 400px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

const Group = styled.div`
    padding: 0.25rem 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &:last-child {
        margin-bottom: 1rem;
    }
`

const GroupTitle = styled.div`
    padding: 0.4rem 0;
    text-transform: uppercase;
    color: var(--color-n600);
    font-size: 0.8rem;
`

const GroupContent = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    row-gap: 0.15rem;
`

const EmojiButton = styled.button`
    width: 2rem;
    height: 2rem;
    padding: 0.15rem;
    background: none;
    outline: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.1s;

    &:hover {
        background-color: var(--color-n100);
    }

    & > img {
        width: 100%;
    }
`
