import {
    forwardRef,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from "react"
import { RiSearchLine as SearchIcon } from "react-icons/ri"
import { FixedSizeList } from "react-window"
import emojis from "src/assets/emojis"
import Flex from "src/components/ui/Flex"
import Input from "src/components/ui/Input"

import Emoji from "../Emoji"
import styles from "./EmojiPicker.module.scss"
import {
    filterEmojis,
    formatEmojis,
    HEIGHT,
    NB_EMOJIS_PER_ROW,
    ROW_HEIGHT,
    WIDTH
} from "./utils"

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
    containerElement: HTMLDivElement | null

    /**
     * Search input dom element
     */
    searchInputElement: HTMLInputElement | null
}

export default forwardRef<EmojiPickerHandle, EmojiPickerProps>(
    function EmojiPicker(props, ref) {
        const { onSelectEmoji = () => {}, searchInput = true } = props

        const containerRef = useRef<HTMLDivElement | null>(null)
        const searchInputRef = useRef<HTMLInputElement | null>(null)
        const listRef = useRef<FixedSizeList | null>(null)

        const [query, setQuery] = useState("")

        const filteredEmojis = useMemo(
            () => filterEmojis(emojis["en"], query),
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
                    listRef.current?.scrollTo(offset ?? 0)
                },
                containerElement: containerRef.current,
                searchInputElement: searchInputRef.current
            }
        })

        return (
            <div ref={containerRef}>
                {searchInput && (
                    <div className={styles.searchInputContainer}>
                        <Input
                            inputRef={searchInputRef}
                            icon={<SearchIcon />}
                            placeholder="Search for emojis..."
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </div>
                )}
                <div className={styles.listContainer}>
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
                </div>
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
            <div className={styles.categoryTitle} style={style} key={index}>
                {row[0]}
            </div>
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
                    <button
                        className={styles.emojiButton}
                        key={emoji.unicode}
                        title={`:${emoji.shortcode}:`}
                    >
                        <Emoji
                            emoji={emoji.unicode}
                            style={{
                                width: `${100 / NB_EMOJIS_PER_ROW}%`
                            }}
                            onClick={() => {
                                onSelectEmoji(emoji.unicode)
                            }}
                        />
                    </button>
                )
            })}
        </Flex>
    )
}
