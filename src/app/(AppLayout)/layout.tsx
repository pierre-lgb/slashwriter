import AppLayout from "src/components/layouts/AppLayout/AppLayout"

export default async function Layout({
    children
}: {
    children: React.ReactNode
}) {
    return <AppLayout>{children}</AppLayout>
}
