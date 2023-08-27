import en from "./en"
import fr from "./fr"

/**
 * Source : https://github.com/kevinfaveri/vue-twemoji-picker/tree/master/emoji-data
 */

// Combine all datasets
const emojis = {
    fr,
    en
}

export default emojis

/*
Steps :
- Download `emoji-all-groups.json` from "https://github.com/kevinfaveri/vue-twemoji-picker/tree/master/emoji-data/"
- Create a `[lang].ts` file (e.g. datasetEN.ts), with the following code inside it (translate category names):

```en.ts
const datasetEN = {
    "People & Emotions": [],
    "Appearance": [],
    "Animals": [],
    "Food & Drinks": [],
    "Travel & Places": [],
    "Activities": [],
    "Objects": [],
    "Symbols": [],
    "Flags": []
}
```

- Copy paste emojis from `emoji-all-groups.json` to `[lang].ts` :
    - "People & Emotions" : Groups 0 and 1
    - "Appearance" : Group 2
    - "Animals": Group 3
    - "Food & Drinks" : Group 4
    - "Travel & Places" : Group 5
    - "Activities" : Group 6
    - "Objects" : Group 7
    - "Symbols" : Group 8
    - "Flags" : Group 9

- Run the following script :
```
import fs from "fs"

import datasetEN from "./en"
import shortcodes from "./shortcodes"

function assignShortcodes(emojiDataset, shortcodes) {
    for (const category in emojiDataset) {
        const categoryEmojis = emojiDataset[category]

        for (const emojiItem of categoryEmojis) {
            const foundEmoji = shortcodes.find(
                (emoji) => emoji.unicode === emojiItem.unicode
            )

            if (foundEmoji) {
                emojiItem.shortcode = foundEmoji.shortcode
            } else {
                emojiItem.shortcode = ""
            }
        }
    }
}

assignShortcodes(datasetEN, shortcodes)

const outputFile = "src/assets/emojis/result.txt"
const content = "const datasetEN = " + JSON.stringify(datasetEN, null, 4) + "\n\nexport default datasetEN"

fs.writeFile(outputFile, content, (err) => {
    if (err) {
        console.error("Error writing to file:", err)
    } else {
        console.log(`Updated emoji data written to ${outputFile}`)
    }
})
```

- Copy paste content of `result.tsx` to `[lang].ts` 

*/
