import { WorkspaceShell } from '@/components/WorkspaceShell'
import { getImageById, getImages } from '@/lib/images'

export async function generateStaticParams() {
  const imgs = await getImages()
  return imgs.map((i) => ({ id: i.id }))
}

export default async function Page({ params }: { params: { id: string } }) {
  const img = await getImageById(params.id)
  return <WorkspaceShell imageUrl={img.url} w={img.width} h={img.height} filename={img.filename} />
}

