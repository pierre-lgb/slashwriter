export const NB_EMOJIS_PER_ROW = 8
export const WIDTH = 300
export const ROW_HEIGHT = 32
export const HEIGHT = NB_EMOJIS_PER_ROW * ROW_HEIGHT

export const formatEmojis = (emojis) => {
    let rowIndex = 0

    return Object.entries(emojis).reduce(
        (acc, [category, emojis]: [string, any]) => {
            const splittedEmojis = []
            for (let i = 0; i < emojis.length; i += NB_EMOJIS_PER_ROW) {
                let colIndex = 0
                const row = emojis
                    .slice(i, i + NB_EMOJIS_PER_ROW)
                    .map((emoji) => ({
                        ...emoji,
                        category,
                        rowIndex,
                        colIndex: colIndex++
                    }))
                splittedEmojis.push(row)
                rowIndex++
            }

            if (category) {
                return splittedEmojis.length
                    ? [...acc, [category], ...splittedEmojis]
                    : acc // Don't render empty categories
            }

            return [...acc, ...splittedEmojis]
        },
        []
    )
}

export const filterEmojis = (emojis, query: string) => {
    const filteredEmojis = {}

    query = query.toLowerCase()

    Object.entries(emojis).forEach(([category, emojis]: [string, any[]]) => {
        filteredEmojis[category] = emojis.filter(
            (emoji) =>
                query.includes(emoji.unicode) ||
                emoji.tags.some((tag: string) => tag.startsWith(query)) ||
                emoji.shortcode.startsWith(query) ||
                emoji.shortcode.replace("_", " ").startsWith(query) ||
                `:${emoji.shortcode}:`.startsWith(query) ||
                category.toLowerCase().startsWith(query)
        )
    })

    return filteredEmojis
}
