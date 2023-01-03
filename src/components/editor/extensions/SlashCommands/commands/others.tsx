import { LoremIpsum } from "lorem-ipsum"
import { MdSubject as ParagraphIcon } from "react-icons/md"

const others = [
    {
        name: "Lorem ipsum",
        description: "Générer un texte lorem ipsum",
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
