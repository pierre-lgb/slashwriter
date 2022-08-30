import Flex from 'src/components/Flex'

import BreadcrumbItem from './BreadcrumbItem'
import BreadcrumbSeparator from './BreadcrumbSeparator'

export default function Breadcrumb(props) {
    return (
        <Flex auto align="center" gap={10}>
            {props.children}
        </Flex>
    )
}

Breadcrumb.Item = BreadcrumbItem
Breadcrumb.Separator = BreadcrumbSeparator
