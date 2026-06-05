import { nanoid } from 'nanoid'

export async function uploadImage(
  bucket: R2Bucket,
  file: File,
  folder = 'products'
): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  const key = `${folder}/${nanoid(16)}.${ext}`
  const buffer = await file.arrayBuffer()
  await bucket.put(key, buffer, {
    httpMetadata: { contentType: file.type },
  })
  return key
}

export function getImageUrl(key: string): string {
  return `/api/image/${key}`
}

export async function deleteImage(bucket: R2Bucket, key: string): Promise<void> {
  await bucket.delete(key)
}
