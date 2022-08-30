import IosShareOutlined from '@mui/icons-material/IosShareOutlined'

import Button from './ui/Button'

interface ShareDocumentButtonProps {}

export default function ShareDocumentButton(props: ShareDocumentButtonProps) {
    return (
        <Button
            text="Partager"
            icon={<IosShareOutlined fontSize="small" />}
            border
        />
    )
}
