import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import styles from './CommandsList.module.css'

export default forwardRef(function CommandsList(props: any, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        setSelectedIndex(0)
    }, [props.items])

    const selectItem = (index) => {
        const item = props.items[index]

        if (item) {
            props.command(item)
        }
    }

    const upHandler = () => {
        setSelectedIndex(
            (selectedIndex + props.items.length - 1) % props.items.length
        )
    }

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length)
    }

    const enterHandler = () => {
        selectItem(selectedIndex)
    }

    useImperativeHandle(ref, () => {
        return {
            onKeyDown: ({ event }) => {
                switch (event.key) {
                    case "ArrowUp":
                        upHandler()
                        return true
                    case "ArrowDown":
                        downHandler()
                        return true
                    case "Enter":
                        enterHandler()
                        return true
                    default:
                        return false
                }
            }
        }
    })

    return (
        <div className="items">
            {props.items.length ? (
                props.items.map((item, index) => (
                    <button
                        className={[
                            styles.item,
                            index === selectedIndex ? styles.selectedItem : ""
                        ].join(" ")}
                        key={index}
                        onClick={() => selectItem(index)}
                    >
                        {JSON.stringify(item)}
                    </button>
                ))
            ) : (
                <div className="item">Aucun résultat</div>
            )}
        </div>
    )
})
