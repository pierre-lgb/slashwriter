import { LoremIpsum } from "lorem-ipsum"
import { RiMistLine as ParagraphIcon } from "react-icons/ri"

const others = [
    {
        name: "Lorem ipsum",
        description: "Generate a random lorem ipsum text",
        aliases: ["lipsum", "random"],
        command: async ({ editor, range }) => {
            const lorem = new LoremIpsum({
                sentencesPerParagraph: {
                    max: 8,
                    min: 4
                },
                wordsPerSentence: {
                    max: 16,
                    min: 4
                }
            })
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertContent(lorem.generateSentences(5))
                .run()
        },
        icon: <ParagraphIcon />
    }
]

export default others
