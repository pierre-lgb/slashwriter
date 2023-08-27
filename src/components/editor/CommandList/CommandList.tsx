import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react"
import Flex from "src/components/ui/Flex"

import styles from "./CommandList.module.scss"

export default forwardRef(function CommandList(props: any, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setSelectedIndex(0)
    }, [props.items])

    useEffect(() => {
        if (menuRef.current) {
            const selectedItem = menuRef.current.querySelector(
                'button[data-selected="true"]'
            )

            if (selectedIndex === 0) {
                menuRef.current.scrollTo({ top: 0, behavior: "smooth" })
            } else if (selectedItem) {
                const itemRect = selectedItem.getBoundingClientRect()
                const menuRect = menuRef.current.getBoundingClientRect()

                if (itemRect.bottom > menuRect.bottom) {
                    menuRef.current.scrollTo({
                        top:
                            itemRect.bottom -
                            menuRect.bottom +
                            menuRef.current.scrollTop,
                        behavior: "smooth"
                    })
                } else if (itemRect.top < menuRect.top) {
                    menuRef.current.scrollTo({
                        top:
                            itemRect.top -
                            menuRect.top +
                            menuRef.current.scrollTop,
                        behavior: "smooth"
                    })
                }
            }
        }
    }, [selectedIndex, menuRef.current])

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
        <div className={styles.commandList} ref={menuRef}>
            {props.items.length ? (
                Object.entries(
                    props.items.reduce((acc, curr) => {
                        const { category } = curr
                        acc[category] = acc[category] ?? []
                        acc[category].push(curr)

                        return acc
                    }, {})
                ).map(([category, content]: [string, any[]], index) => (
                    <div className={styles.category} key={index}>
                        <div className={styles.categoryName}>
                            <div>{category}</div>
                        </div>
                        {content.map((item) => (
                            <button
                                className={`${styles.item} ${
                                    selectedIndex === item.index
                                        ? styles.selected
                                        : ""
                                }`}
                                key={item.index}
                                onClick={() => selectItem(item.index)}
                                data-selected={selectedIndex === item.index}
                            >
                                <div className={styles.itemIconContainer}>
                                    {item.icon}
                                </div>
                                <Flex column gap={3}>
                                    <div className={styles.itemName}>
                                        {item.name}
                                    </div>
                                    <div className={styles.itemDescription}>
                                        {item.description}
                                    </div>
                                </Flex>
                            </button>
                        ))}
                    </div>
                ))
            ) : (
                <span className={styles.noResult}>No command found</span>
            )}
        </div>
    )
})
