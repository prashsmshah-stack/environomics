import type { CollectionAfterDeleteHook, CollectionBeforeChangeHook, CollectionSlug } from 'payload'

type SortableDoc = {
  id: number | string
  sortOrder?: number | null
}

async function getSortableDocs({
  collection,
  req,
}: {
  collection: CollectionSlug
  req: Parameters<CollectionBeforeChangeHook>[0]['req']
}) {
  const result = await req.payload.find({
    collection,
    depth: 0,
    limit: 1000,
    overrideAccess: true,
    sort: 'sortOrder',
  })

  return result.docs as SortableDoc[]
}

function getNumericOrder(value: unknown, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : fallback
}

export function makeBeforeChangeReorderHook(
  collection: CollectionSlug,
): CollectionBeforeChangeHook {
  return async ({ context, data, operation, originalDoc, req }) => {
    if (context.skipSortOrderSync) {
      return data
    }

    const docs = await getSortableDocs({ collection, req })
    const maxOrder = docs.reduce(
      (max, doc) => Math.max(max, getNumericOrder(doc.sortOrder, 0)),
      0,
    )
    const requestedOrder = getNumericOrder(data.sortOrder, maxOrder + 1)

    if (operation === 'create') {
      for (const doc of docs.filter((item) => getNumericOrder(item.sortOrder, 0) >= requestedOrder)) {
        await req.payload.update({
          id: doc.id,
          collection,
          context: { skipSortOrderSync: true },
          data: {
            sortOrder: getNumericOrder(doc.sortOrder, 0) + 1,
          },
          overrideAccess: true,
        })
      }

      return {
        ...data,
        sortOrder: requestedOrder,
      }
    }

    const originalOrder = getNumericOrder(originalDoc?.sortOrder, requestedOrder)

    if (requestedOrder === originalOrder) {
      return {
        ...data,
        sortOrder: requestedOrder,
      }
    }

    for (const doc of docs.filter((item) => item.id !== originalDoc?.id)) {
      const currentOrder = getNumericOrder(doc.sortOrder, 0)
      let nextOrder = currentOrder

      if (requestedOrder < originalOrder && currentOrder >= requestedOrder && currentOrder < originalOrder) {
        nextOrder = currentOrder + 1
      }

      if (requestedOrder > originalOrder && currentOrder <= requestedOrder && currentOrder > originalOrder) {
        nextOrder = currentOrder - 1
      }

      if (nextOrder !== currentOrder) {
        await req.payload.update({
          id: doc.id,
          collection,
          context: { skipSortOrderSync: true },
          data: {
            sortOrder: nextOrder,
          },
          overrideAccess: true,
        })
      }
    }

    return {
      ...data,
      sortOrder: requestedOrder,
    }
  }
}

export function makeAfterDeleteReorderHook(collection: CollectionSlug): CollectionAfterDeleteHook {
  return async ({ doc, req }) => {
    const deletedOrder = getNumericOrder(doc.sortOrder, 0)

    if (!deletedOrder) {
      return doc
    }

    const docs = await getSortableDocs({ collection, req })

    for (const item of docs.filter((current) => getNumericOrder(current.sortOrder, 0) > deletedOrder)) {
      await req.payload.update({
        id: item.id,
        collection,
        context: { skipSortOrderSync: true },
        data: {
          sortOrder: getNumericOrder(item.sortOrder, 0) - 1,
        },
        overrideAccess: true,
      })
    }

    return doc
  }
}
