import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react"
import { RiSearchLine as SearchIcon } from "react-icons/ri"
import { FixedSizeList } from "react-window"
import Flex from "src/components/Flex"
import Input from "src/components/ui/Input"
import styled from "styled-components"

import Emoji from "./Emoji"
import emojis from "./emojis"
import { filterEmojis, formatEmojis, HEIGHT, NB_EMOJIS_PER_ROW, ROW_HEIGHT, WIDTH } from "./utils"

export interface EmojiPickerProps {
    /**
     * Called when an emoji is selected
     *
     * @param emoji
     * @returns
     */
    onSelectEmoji?: (emoji: string) => any

    /**
     * Whether the emoji picker has a search input or not
     */
    searchInput?: boolean
}

export interface EmojiPickerHandle {
    /**
     * Update the search input query value
     *
     * @param value
     */
    setQuery(value?: string): void

    /**
     * Scroll the emoji list to the given offset
     *
     * @param offset
     */
    scrollTo(offset?: number): void

    /**
     * Picker's container dom element
     */
    containerElement: HTMLDivElement

    /**
     * Search input dom element
     */
    searchInputElement: HTMLInputElement
}

export default forwardRef<EmojiPickerHandle, EmojiPickerProps>(
    function EmojiPicker(props, ref) {
        const { onSelectEmoji = () => {}, searchInput = true } = props

        const containerRef = useRef<HTMLDivElement>()
        const searchInputRef = useRef<HTMLInputElement>()
        const listRef = useRef<FixedSizeList>()

        const [query, setQuery] = useState("")

        const filteredEmojis = useMemo(
            () => filterEmojis(emojis["fr"], query),
            [query]
        )
        const rows = useMemo(
            () => formatEmojis(filteredEmojis),
            [filteredEmojis]
        )

        useImperativeHandle(ref, () => {
            return {
                setQuery: (value?: string) => {
                    setQuery(value ?? "")
                },
                scrollTo: (offset?: number) => {
                    listRef.current.scrollTo(offset ?? 0)
                },
                containerElement: containerRef.current,
                searchInputElement: searchInputRef.current
            }
        })

        return (
            <div ref={containerRef}>
                {searchInput && (
                    <SearchInputContainer>
                        <Input
                            inputRef={searchInputRef}
                            icon={<SearchIcon />}
                            placeholder="Rechercher..."
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </SearchInputContainer>
                )}
                <ListContainer>
                    <FixedSizeList
                        height={HEIGHT}
                        overscanCount={3}
                        itemCount={rows.length}
                        itemData={{
                            rows,
                            onSelectEmoji
                        }}
                        itemSize={ROW_HEIGHT}
                        width={WIDTH}
                        ref={listRef}
                    >
                        {EmojiRow}
                    </FixedSizeList>
                </ListContainer>
            </div>
        )
    }
)

const EmojiRow = ({ data, index, style }) => {
    const { rows, onSelectEmoji } = data
    const row = rows[index]

    // Category
    if (typeof row[0] === "string") {
        return (
            <CategoryTitle style={style} key={index}>
                {row[0]}
            </CategoryTitle>
        )
    }

    return (
        <Flex
            style={{
                ...style,
                padding: "0 0.5rem"
            }}
        >
            {row.map((emoji) => {
                return (
                    <EmojiButton key={emoji.unicode}>
                        <Emoji
                            emoji={emoji.unicode}
                            style={{
                                width: `${100 / NB_EMOJIS_PER_ROW}%`
                            }}
                            onClick={() => {
                                onSelectEmoji(emoji.unicode)
                            }}
                        />
                    </EmojiButton>
                )
            })}
        </Flex>
    )
}

const SearchInputContainer = styled.div`
    padding: 0.25rem;
`

const ListContainer = styled.div`
    padding-bottom: 0.5rem;
    max-height: 400px;
`

const CategoryTitle = styled.div`
    text-transform: uppdercase;
    padding: 0.5rem;
    text-transform: uppercase;
    color: var(--color-n600);
    font-size: 0.8rem;
    width: 100%;
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
