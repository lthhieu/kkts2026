export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    return <div style={{ marginTop: 32 }}>My Post: {slug}</div>
}