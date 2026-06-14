export async function searchProducts(
  vectorize: VectorizeIndex,
  query: number[],
  options?: {
    topK?: number
    filter?: Record<string, string>
    returnMetadata?: boolean
  },
) {
  const { topK = 20, filter, returnMetadata = true } = options || {}

  const result = await vectorize.query(query, {
    topK,
    filter,
    returnMetadata,
  })

  return result.matches.map((match) => ({
    id: match.id,
    score: match.score,
    metadata: match.metadata,
  }))
}

export async function getSimilarProducts(
  vectorize: VectorizeIndex,
  productId: string,
  topK = 6,
) {
  const result = await vectorize.queryById(productId, { topK })
  return result.matches
    .filter((m) => m.id !== productId)
    .map((match) => ({
      id: match.id,
      score: match.score,
      metadata: match.metadata,
    }))
}

export async function upsertProductVectors(
  vectorize: VectorizeIndex,
  vectors: Array<{
    id: string
    values: number[]
    metadata?: Record<string, unknown>
  }>,
) {
  await vectorize.upsert(vectors)
}

export async function deleteProductVectors(
  vectorize: VectorizeIndex,
  ids: string[],
) {
  await vectorize.deleteByIds(ids)
}

export async function generateEmbedding(
  ai: Ai,
  text: string,
): Promise<number[]> {
  const model = "@cf/baai/bge-base-en-v1.5"
  const result = await ai.run(model, { text: [text] })
  return result.data[0]
}

export async function generateProductEmbedding(
  ai: Ai,
  product: {
    name: string
    description?: string | null
    brand?: string | null
    tags?: string[]
  },
): Promise<number[]> {
  const text = [
    product.name,
    product.description || "",
    product.brand || "",
    (product.tags || []).join(" "),
  ]
    .filter(Boolean)
    .join(". ")

  return generateEmbedding(ai, text)
}

export async function semanticSearch(
  ai: Ai,
  vectorize: VectorizeIndex,
  query: string,
  topK = 20,
) {
  const embedding = await generateEmbedding(ai, query)
  return searchProducts(vectorize, embedding, { topK })
}
