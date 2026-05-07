const PROJECT_UID = 'api::project.project' as any;

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

async function getAllProjects() {
  return strapi.db.query(PROJECT_UID).findMany({
    select: ['id', 'displayOrder', 'createdAt', 'updatedAt'],
    orderBy: [
      { displayOrder: 'asc' },
      { createdAt: 'asc' },
      { id: 'asc' },
    ],
  } as any);
}

async function persistSequentialOrder(projects: any[]) {
  if (!projects.length) {
    return;
  }

  isSyncingDisplayOrder = true;
  strapi.db.lifecycles.disable();

  try {
    for (const [index, project] of projects.entries()) {
      const nextOrder = index + 1;

      if (Number(project.displayOrder) === nextOrder) {
        continue;
      }

      await strapi.db.query(PROJECT_UID).update({
        where: { id: project.id },
        data: { displayOrder: nextOrder },
      } as any);
    }
  } finally {
    strapi.db.lifecycles.enable();
    isSyncingDisplayOrder = false;
  }
}

async function moveProjectToRequestedOrder(project: any) {
  if (!project?.id || isSyncingDisplayOrder) {
    return;
  }

  const projects = await getAllProjects();
  const movedProject = projects.find((item: any) => item.id === project.id) || project;
  const otherProjects = projects.filter((item: any) => item.id !== project.id);
  const requestedOrder = clampOrder(
    toPositiveInteger(project.displayOrder, projects.length),
    projects.length
  );

  otherProjects.splice(requestedOrder - 1, 0, movedProject);
  await persistSequentialOrder(otherProjects);
}

async function normalizeProjectOrder() {
  if (isSyncingDisplayOrder) {
    return;
  }

  const projects = await getAllProjects();
  await persistSequentialOrder(projects);
}

export default {
  async afterCreate(event: any) {
    await moveProjectToRequestedOrder(event.result);
  },

  async afterUpdate(event: any) {
    await moveProjectToRequestedOrder(event.result);
  },

  async afterDelete() {
    await normalizeProjectOrder();
  },
};
