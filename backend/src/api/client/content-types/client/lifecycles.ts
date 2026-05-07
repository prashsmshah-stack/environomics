const CLIENT_UID = 'api::client.client' as any;

declare const strapi: any;

let isSyncingDisplayOrder = false;

function toPositiveInteger(value: unknown, fallback: number) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return fallback;
  }

  return Math.max(1, Math.trunc(numericValue));
}

function clampOrder(value: number, itemCount: number) {
  if (itemCount <= 0) {
    return 1;
  }

  return Math.min(Math.max(value, 1), itemCount);
}

async function getAllClients() {
  return strapi.db.query(CLIENT_UID).findMany({
    select: ['id', 'displayOrder', 'createdAt', 'updatedAt'],
    orderBy: [
      { displayOrder: 'asc' },
      { createdAt: 'asc' },
      { id: 'asc' },
    ],
  } as any);
}

async function persistSequentialOrder(clients: any[]) {
  if (!clients.length) {
    return;
  }

  isSyncingDisplayOrder = true;
  strapi.db.lifecycles.disable();

  try {
    for (const [index, client] of clients.entries()) {
      const nextOrder = index + 1;

      if (Number(client.displayOrder) === nextOrder) {
        continue;
      }

      await strapi.db.query(CLIENT_UID).update({
        where: { id: client.id },
        data: { displayOrder: nextOrder },
      } as any);
    }
  } finally {
    strapi.db.lifecycles.enable();
    isSyncingDisplayOrder = false;
  }
}

async function moveClientToRequestedOrder(client: any) {
  if (!client?.id || isSyncingDisplayOrder) {
    return;
  }

  const clients = await getAllClients();
  const movedClient = clients.find((item: any) => item.id === client.id) || client;
  const otherClients = clients.filter((item: any) => item.id !== client.id);
  const requestedOrder = clampOrder(
    toPositiveInteger(client.displayOrder, clients.length),
    clients.length
  );

  otherClients.splice(requestedOrder - 1, 0, movedClient);
  await persistSequentialOrder(otherClients);
}

async function normalizeClientOrder() {
  if (isSyncingDisplayOrder) {
    return;
  }

  const clients = await getAllClients();
  await persistSequentialOrder(clients);
}

export default {
  async afterCreate(event: any) {
    await moveClientToRequestedOrder(event.result);
  },

  async afterUpdate(event: any) {
    await moveClientToRequestedOrder(event.result);
  },

  async afterDelete() {
    await normalizeClientOrder();
  },
};
