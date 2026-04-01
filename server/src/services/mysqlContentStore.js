import { env } from "../config/env.js";
import { buildDefaultContent } from "../data/defaultContent.js";
import { createHttpError } from "../lib/http.js";
import { getMysqlPool } from "../lib/mysql.js";
import { hashPassword } from "../lib/password.js";
import { createEntityId, nowIso } from "../utils/id.js";

const sectionConfig = {
  projects: {
    table: "projects",
    idPrefix: "project",
    orderable: true
  },
  clients: {
    table: "clients",
    idPrefix: "client",
    orderable: true
  },
  testimonials: {
    table: "testimonials",
    idPrefix: "testimonial",
    orderable: true
  },
  leads: {
    table: "leads",
    idPrefix: "lead",
    orderable: false
  }
};

const singletonSections = new Set(["home", "contact", "seo", "settings"]);

let initialized = false;

function isPublishedProject(item = {}) {
  const status = String(item?.status ?? "").trim().toLowerCase();
  return !status || status === "published";
}

function filterPublicProjects(items = []) {
  return items.filter(isPublishedProject);
}

function publicContentFrom(content) {
  return {
    home: content.home,
    projects: filterPublicProjects(content.projects ?? []),
    clients: content.clients,
    testimonials: content.testimonials,
    contact: content.contact,
    seo: content.seo,
    settings: content.settings,
    meta: content.meta
  };
}

function assertArraySection(section) {
  if (!Object.hasOwn(sectionConfig, section)) {
    throw createHttpError(404, `Unknown collection: ${section}`);
  }
}

function assertSingletonSection(section) {
  if (!singletonSections.has(section)) {
    throw createHttpError(404, `Unknown section: ${section}`);
  }
}

function hasOwn(payload, key) {
  return Object.prototype.hasOwnProperty.call(payload ?? {}, key);
}

function emptyToNull(value) {
  if (value === undefined || value === null) {
    return null;
  }

  const text = String(value).trim();
  return text ? text : null;
}

function toMysqlDateTime(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  return safeDate.toISOString().slice(0, 19).replace("T", " ");
}

function toIso(value) {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
}

function parseJsonArray(value) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapProjectRow(row) {
  return {
    id: row.id,
    name: row.name ?? "",
    capacity: row.capacity ?? "",
    description: row.description ?? "",
    status: row.status ?? "Published",
    direction: row.direction ?? "left",
    image: row.image_path ?? "",
    companyLogo: row.company_logo_path ?? ""
  };
}

function mapClientRow(row) {
  return {
    id: row.id,
    name: row.company_name ?? "",
    category: row.category ?? "",
    year: row.year ?? "",
    capacity: row.capacity ?? "",
    companyLogo: row.company_logo_path ?? ""
  };
}

function mapTestimonialRow(row) {
  return {
    id: row.id,
    title: row.title ?? "",
    subtitle: row.subtitle ?? "",
    tag: row.tag ?? "",
    capacity: row.capacity ?? "",
    installed: row.installed ?? "",
    description: row.description ?? "",
    image: row.image_path ?? ""
  };
}

function mapLeadRow(row) {
  return {
    id: row.id,
    name: row.name ?? "",
    company: row.company ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    requirement: row.requirement ?? "",
    stage: row.stage ?? "New",
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at)
  };
}

function mapSocialRow(row) {
  return {
    id: row.id,
    platform: row.platform ?? "",
    handle: row.handle ?? "",
    url: row.url ?? "",
    logo: row.logo_path ?? ""
  };
}

function mapSeoPageRow(row) {
  return {
    title: row.meta_title ?? "",
    description: row.meta_description ?? ""
  };
}

function mapProjectPayload(payload = {}) {
  const record = {};

  if (hasOwn(payload, "name")) record.name = String(payload.name ?? "").trim();
  if (hasOwn(payload, "capacity")) record.capacity = emptyToNull(payload.capacity);
  if (hasOwn(payload, "description")) record.description = emptyToNull(payload.description);
  if (hasOwn(payload, "status")) record.status = String(payload.status ?? "Published").trim() || "Published";
  if (hasOwn(payload, "direction")) record.direction = payload.direction === "right" ? "right" : "left";
  if (hasOwn(payload, "image")) record.image_path = emptyToNull(payload.image);
  if (hasOwn(payload, "companyLogo")) record.company_logo_path = emptyToNull(payload.companyLogo);
  if (hasOwn(payload, "isActive")) record.is_active = payload.isActive ? 1 : 0;

  return record;
}

function mapClientPayload(payload = {}) {
  const record = {};

  if (hasOwn(payload, "name")) record.company_name = String(payload.name ?? "").trim();
  if (hasOwn(payload, "category")) record.category = emptyToNull(payload.category);
  if (hasOwn(payload, "year")) record.year = emptyToNull(payload.year);
  if (hasOwn(payload, "capacity")) record.capacity = emptyToNull(payload.capacity);
  if (hasOwn(payload, "companyLogo")) record.company_logo_path = emptyToNull(payload.companyLogo);
  if (hasOwn(payload, "isActive")) record.is_active = payload.isActive ? 1 : 0;

  return record;
}

function mapTestimonialPayload(payload = {}) {
  const record = {};

  if (hasOwn(payload, "title")) record.title = String(payload.title ?? "").trim();
  if (hasOwn(payload, "subtitle")) record.subtitle = emptyToNull(payload.subtitle);
  if (hasOwn(payload, "tag")) record.tag = emptyToNull(payload.tag);
  if (hasOwn(payload, "capacity")) record.capacity = emptyToNull(payload.capacity);
  if (hasOwn(payload, "installed")) record.installed = emptyToNull(payload.installed);
  if (hasOwn(payload, "description")) record.description = String(payload.description ?? "").trim();
  if (hasOwn(payload, "image")) record.image_path = emptyToNull(payload.image);
  if (hasOwn(payload, "isActive")) record.is_active = payload.isActive ? 1 : 0;

  return record;
}

function mapLeadPayload(payload = {}) {
  const record = {};

  if (hasOwn(payload, "name")) record.name = String(payload.name ?? "").trim();
  if (hasOwn(payload, "company")) record.company = emptyToNull(payload.company);
  if (hasOwn(payload, "email")) record.email = String(payload.email ?? "").trim();
  if (hasOwn(payload, "phone")) record.phone = emptyToNull(payload.phone);
  if (hasOwn(payload, "requirement")) record.requirement = emptyToNull(payload.requirement);
  if (hasOwn(payload, "stage")) record.stage = String(payload.stage ?? "New").trim() || "New";
  if (hasOwn(payload, "createdAt")) record.created_at = toMysqlDateTime(payload.createdAt);

  return record;
}

function mapSocialPayload(payload = {}) {
  const record = {};

  if (hasOwn(payload, "platform")) record.platform = String(payload.platform ?? "").trim();
  if (hasOwn(payload, "handle")) record.handle = emptyToNull(payload.handle);
  if (hasOwn(payload, "url")) record.url = String(payload.url ?? "").trim();
  if (hasOwn(payload, "logo")) record.logo_path = emptyToNull(payload.logo);
  if (hasOwn(payload, "isActive")) record.is_active = payload.isActive ? 1 : 0;

  return record;
}

function mapSectionRow(section, row) {
  switch (section) {
    case "projects":
      return mapProjectRow(row);
    case "clients":
      return mapClientRow(row);
    case "testimonials":
      return mapTestimonialRow(row);
    case "leads":
      return mapLeadRow(row);
    default:
      return row;
  }
}

function mapSectionPayload(section, payload) {
  switch (section) {
    case "projects":
      return mapProjectPayload(payload);
    case "clients":
      return mapClientPayload(payload);
    case "testimonials":
      return mapTestimonialPayload(payload);
    case "leads":
      return mapLeadPayload(payload);
    default:
      return {};
  }
}
async function queryOne(connection, sql, params = []) {
  const [rows] = await connection.query(sql, params);
  return rows[0] ?? null;
}

async function columnExists(connection, tableName, columnName) {
  const row = await queryOne(
    connection,
    `SELECT 1 AS present
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?
     LIMIT 1`,
    [tableName, columnName]
  );

  return Boolean(row?.present);
}

async function ensureProjectDescriptionColumn(connection) {
  const hasDescriptionColumn = await columnExists(connection, "projects", "description");

  if (hasDescriptionColumn) {
    return;
  }

  await connection.query(
    "ALTER TABLE projects ADD COLUMN description TEXT DEFAULT NULL AFTER capacity"
  );
}

async function ensureSiteSettingsHeaderLogoColumn(connection) {
  const hasHeaderLogoColumn = await columnExists(connection, "site_settings", "header_logo_path");

  if (hasHeaderLogoColumn) {
    return;
  }

  await connection.query(
    "ALTER TABLE site_settings ADD COLUMN header_logo_path VARCHAR(500) DEFAULT NULL AFTER domain"
  );
}

async function backfillProjectDescriptions(connection) {
  const defaults = buildDefaultContent().projects ?? [];

  for (const item of defaults) {
    const description = emptyToNull(item.description);

    if (!description) {
      continue;
    }

    await connection.query(
      `UPDATE projects
       SET description = ?
       WHERE id = ?
         AND (description IS NULL OR TRIM(description) = '')`,
      [description, item.id]
    );
  }
}

async function countRows(connection, table) {
  const row = await queryOne(connection, `SELECT COUNT(*) AS count FROM ${table}`);
  return Number(row?.count ?? 0);
}

async function getLatestUpdatedAt(connection) {
  const row = await queryOne(
    connection,
    `SELECT MAX(updated_at) AS updatedAt
     FROM (
       SELECT updated_at FROM home_content
       UNION ALL SELECT updated_at FROM projects
       UNION ALL SELECT updated_at FROM clients
       UNION ALL SELECT updated_at FROM testimonials
       UNION ALL SELECT updated_at FROM leads
       UNION ALL SELECT updated_at FROM contact_settings
       UNION ALL SELECT updated_at FROM social_links
       UNION ALL SELECT updated_at FROM seo_pages
       UNION ALL SELECT updated_at FROM seo_schema_settings
       UNION ALL SELECT updated_at FROM site_settings
     ) AS updates`
  );

  return toIso(row?.updatedAt);
}

async function fetchHome(connection) {
  const row = await queryOne(connection, "SELECT * FROM home_content ORDER BY id ASC LIMIT 1");

  return {
    title: row?.hero_title ?? "",
    subtitle: row?.hero_subtitle ?? "",
    ctaPrimary: row?.cta_primary ?? "",
    ctaSecondary: row?.cta_secondary ?? ""
  };
}

async function fetchContact(connection) {
  const row = await queryOne(connection, "SELECT * FROM contact_settings ORDER BY id ASC LIMIT 1");
  const socials = await fetchSocialLinks(connection);

  return {
    phone: row?.phone ?? "",
    email: row?.email ?? "",
    address: row?.address ?? "",
    linkedin: row?.linkedin_url ?? "",
    socials
  };
}

async function fetchSeo(connection) {
  const [pageRows] = await connection.query(
    "SELECT route_key, meta_title, meta_description FROM seo_pages ORDER BY id ASC"
  );
  const schemaRow = await queryOne(
    connection,
    "SELECT * FROM seo_schema_settings ORDER BY id ASC LIMIT 1"
  );

  const pages = Object.fromEntries(pageRows.map((row) => [row.route_key, mapSeoPageRow(row)]));
  const schema = {
    organizationName: schemaRow?.organization_name ?? "",
    websiteName: schemaRow?.website_name ?? "",
    siteUrl: schemaRow?.site_url ?? "",
    logo: schemaRow?.logo_path ?? "",
    defaultImage: schemaRow?.default_image_path ?? "",
    sameAs: parseJsonArray(schemaRow?.same_as_json)
  };

  return {
    pages,
    schema,
    homeTitle: pages.home?.title ?? "",
    homeDescription: pages.home?.description ?? ""
  };
}

async function fetchSettings(connection) {
  const row = await queryOne(connection, "SELECT * FROM site_settings ORDER BY id ASC LIMIT 1");
  const schemaRow = await queryOne(
    connection,
    "SELECT logo_path FROM seo_schema_settings ORDER BY id ASC LIMIT 1"
  );

  return {
    footerYear: row?.footer_year ?? "",
    domain: row?.domain ?? "",
    companyLogo: schemaRow?.logo_path ?? "",
    headerLogo: row?.header_logo_path ?? ""
  };
}

async function fetchSectionRow(connection, section, id) {
  const { table } = sectionConfig[section];
  const row = await queryOne(connection, `SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [id]);

  return row ? mapSectionRow(section, row) : null;
}

async function fetchCollectionRows(connection, section) {
  const { table, orderable } = sectionConfig[section];
  const orderBy = orderable ? "sort_order ASC, created_at ASC" : "created_at DESC, id DESC";
  const [rows] = await connection.query(`SELECT * FROM ${table} ORDER BY ${orderBy}`);
  return rows.map((row) => mapSectionRow(section, row));
}

async function fetchSocialLinks(connection) {
  const [rows] = await connection.query(
    "SELECT * FROM social_links ORDER BY sort_order ASC, created_at ASC"
  );

  return rows.map(mapSocialRow);
}

async function updateSingletonRow(connection, table, payload) {
  const existingRow = await queryOne(connection, `SELECT id FROM ${table} ORDER BY id ASC LIMIT 1`);
  const entries = Object.entries(payload);

  if (!entries.length) {
    return existingRow?.id ?? null;
  }

  if (!existingRow) {
    const columns = entries.map(([column]) => column);
    const placeholders = columns.map(() => "?");
    await connection.query(
      `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`,
      entries.map(([, value]) => value)
    );
    const inserted = await queryOne(connection, `SELECT id FROM ${table} ORDER BY id DESC LIMIT 1`);
    return inserted?.id ?? null;
  }

  const assignments = entries.map(([column]) => `${column} = ?`);
  await connection.query(
    `UPDATE ${table} SET ${assignments.join(", ")} WHERE id = ?`,
    [...entries.map(([, value]) => value), existingRow.id]
  );

  return existingRow.id;
}

async function upsertSeoPage(connection, routeKey, page) {
  const existingRow = await queryOne(
    connection,
    "SELECT id FROM seo_pages WHERE route_key = ? LIMIT 1",
    [routeKey]
  );
  const nextPage = {
    title: String(page?.title ?? "").trim(),
    description: String(page?.description ?? "").trim()
  };

  if (!existingRow) {
    await connection.query(
      "INSERT INTO seo_pages (route_key, meta_title, meta_description) VALUES (?, ?, ?)",
      [routeKey, nextPage.title, nextPage.description]
    );
    return;
  }

  await connection.query(
    "UPDATE seo_pages SET meta_title = ?, meta_description = ? WHERE id = ?",
    [nextPage.title, nextPage.description, existingRow.id]
  );
}

async function ensureAdminBootstrap(connection) {
  const adminCount = await countRows(connection, "admin_users");

  if (adminCount > 0) {
    return;
  }

  const passwordHash = await hashPassword(env.adminPassword);

  await connection.query(
    `INSERT INTO admin_users (name, email, username, password_hash, role, is_active)
     VALUES (?, ?, ?, ?, 'admin', 1)`,
    ["Admin", env.adminEmail, env.adminUsername, passwordHash]
  );
}

async function seedDefaultsIfEmpty(connection) {
  const defaults = buildDefaultContent();

  if ((await countRows(connection, "home_content")) === 0) {
    await connection.query(
      "INSERT INTO home_content (hero_title, hero_subtitle, cta_primary, cta_secondary) VALUES (?, ?, ?, ?)",
      [defaults.home.title, defaults.home.subtitle, defaults.home.ctaPrimary, defaults.home.ctaSecondary]
    );
  }

  if ((await countRows(connection, "projects")) === 0) {
    for (const [index, item] of defaults.projects.entries()) {
      await connection.query(
        `INSERT INTO projects
         (id, name, capacity, description, status, direction, image_path, company_logo_path, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          item.id,
          item.name,
          emptyToNull(item.capacity),
          emptyToNull(item.description),
          item.status ?? "Published",
          item.direction === "right" ? "right" : "left",
          emptyToNull(item.image),
          emptyToNull(item.companyLogo),
          index + 1
        ]
      );
    }
  }

  if ((await countRows(connection, "clients")) === 0) {
    for (const [index, item] of defaults.clients.entries()) {
      await connection.query(
        `INSERT INTO clients
         (id, company_name, category, year, capacity, company_logo_path, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          item.id,
          item.name,
          emptyToNull(item.category),
          emptyToNull(item.year),
          emptyToNull(item.capacity),
          emptyToNull(item.companyLogo),
          index + 1
        ]
      );
    }
  }

  if ((await countRows(connection, "testimonials")) === 0) {
    for (const [index, item] of defaults.testimonials.entries()) {
      await connection.query(
        `INSERT INTO testimonials
         (id, title, subtitle, tag, capacity, installed, description, image_path, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          item.id,
          item.title,
          emptyToNull(item.subtitle),
          emptyToNull(item.tag),
          emptyToNull(item.capacity),
          emptyToNull(item.installed),
          item.description,
          emptyToNull(item.image),
          index + 1
        ]
      );
    }
  }
  if ((await countRows(connection, "leads")) === 0) {
    for (const item of defaults.leads) {
      await connection.query(
        `INSERT INTO leads
         (id, name, company, email, phone, requirement, stage, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.name,
          emptyToNull(item.company),
          item.email,
          emptyToNull(item.phone),
          emptyToNull(item.requirement),
          item.stage ?? "New",
          toMysqlDateTime(item.createdAt)
        ]
      );
    }
  }

  if ((await countRows(connection, "contact_settings")) === 0) {
    await connection.query(
      "INSERT INTO contact_settings (phone, email, address, linkedin_url) VALUES (?, ?, ?, ?)",
      [
        defaults.contact.phone,
        defaults.contact.email,
        defaults.contact.address,
        defaults.contact.linkedin
      ]
    );
  }

  if ((await countRows(connection, "social_links")) === 0) {
    for (const [index, item] of defaults.contact.socials.entries()) {
      await connection.query(
        `INSERT INTO social_links
         (id, platform, handle, url, logo_path, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [
          item.id,
          item.platform,
          emptyToNull(item.handle),
          item.url,
          emptyToNull(item.logo),
          index + 1
        ]
      );
    }
  }

  if ((await countRows(connection, "seo_pages")) === 0) {
    for (const [routeKey, page] of Object.entries(defaults.seo.pages)) {
      await connection.query(
        "INSERT INTO seo_pages (route_key, meta_title, meta_description) VALUES (?, ?, ?)",
        [routeKey, page.title, page.description]
      );
    }
  }

  if ((await countRows(connection, "seo_schema_settings")) === 0) {
    await connection.query(
      `INSERT INTO seo_schema_settings
       (organization_name, website_name, site_url, logo_path, default_image_path, same_as_json)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        defaults.seo.schema.organizationName,
        defaults.seo.schema.websiteName,
        defaults.seo.schema.siteUrl,
        emptyToNull(defaults.seo.schema.logo),
        emptyToNull(defaults.seo.schema.defaultImage),
        JSON.stringify(defaults.seo.schema.sameAs ?? [])
      ]
    );
  }

  if ((await countRows(connection, "site_settings")) === 0) {
    await connection.query(
      "INSERT INTO site_settings (footer_year, domain, header_logo_path) VALUES (?, ?, ?)",
      [
        defaults.settings.footerYear,
        defaults.settings.domain,
        emptyToNull(defaults.settings.headerLogo)
      ]
    );
  }
}

export async function initialize() {
  if (initialized) {
    return;
  }

  const pool = getMysqlPool();

  try {
    await pool.query("SELECT 1 FROM home_content LIMIT 1");
  } catch (error) {
    if (error?.code === "ER_NO_SUCH_TABLE") {
      throw createHttpError(
        500,
        "MySQL schema tables were not found. Import server/database/mysql/schema.sql first."
      );
    }

    throw error;
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await ensureAdminBootstrap(connection);
    await ensureProjectDescriptionColumn(connection);
    await ensureSiteSettingsHeaderLogoColumn(connection);
    await seedDefaultsIfEmpty(connection);
    await backfillProjectDescriptions(connection);
    await connection.commit();
    initialized = true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getContent() {
  const pool = getMysqlPool();
  const [home, projects, clients, testimonials, contact, seo, settings, updatedAt] = await Promise.all([
    fetchHome(pool),
    fetchCollectionRows(pool, "projects"),
    fetchCollectionRows(pool, "clients"),
    fetchCollectionRows(pool, "testimonials"),
    fetchContact(pool),
    fetchSeo(pool),
    fetchSettings(pool),
    getLatestUpdatedAt(pool)
  ]);

  return {
    home,
    projects,
    clients,
    testimonials,
    contact,
    seo,
    settings,
    meta: {
      version: 1,
      storage: "mysql",
      updatedAt: updatedAt ?? nowIso()
    }
  };
}

export async function getPublicContent() {
  const content = await getContent();
  return publicContentFrom(content);
}

export async function resetContent() {
  const pool = getMysqlPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query("DELETE FROM projects");
    await connection.query("DELETE FROM clients");
    await connection.query("DELETE FROM testimonials");
    await connection.query("DELETE FROM leads");
    await connection.query("DELETE FROM social_links");
    await connection.query("DELETE FROM seo_pages");
    await connection.query("DELETE FROM home_content");
    await connection.query("DELETE FROM contact_settings");
    await connection.query("DELETE FROM seo_schema_settings");
    await connection.query("DELETE FROM site_settings");
    await seedDefaultsIfEmpty(connection);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return getContent();
}

export async function getSingletonSection(section) {
  assertSingletonSection(section);
  const pool = getMysqlPool();

  switch (section) {
    case "home":
      return fetchHome(pool);
    case "contact":
      return fetchContact(pool);
    case "seo":
      return fetchSeo(pool);
    case "settings":
      return fetchSettings(pool);
    default:
      return null;
  }
}

export async function updateSingletonSection(section, payload) {
  assertSingletonSection(section);
  const pool = getMysqlPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (section === "home") {
      const record = {};
      if (hasOwn(payload, "title")) record.hero_title = String(payload.title ?? "").trim();
      if (hasOwn(payload, "subtitle")) record.hero_subtitle = String(payload.subtitle ?? "").trim();
      if (hasOwn(payload, "ctaPrimary")) record.cta_primary = String(payload.ctaPrimary ?? "").trim();
      if (hasOwn(payload, "ctaSecondary")) record.cta_secondary = String(payload.ctaSecondary ?? "").trim();
      await updateSingletonRow(connection, "home_content", record);
    }

    if (section === "contact") {
      const record = {};
      if (hasOwn(payload, "phone")) record.phone = emptyToNull(payload.phone);
      if (hasOwn(payload, "email")) record.email = emptyToNull(payload.email);
      if (hasOwn(payload, "address")) record.address = emptyToNull(payload.address);
      if (hasOwn(payload, "linkedin")) record.linkedin_url = emptyToNull(payload.linkedin);
      await updateSingletonRow(connection, "contact_settings", record);
    }

    if (section === "seo") {
      const currentSeo = await fetchSeo(connection);

      if (hasOwn(payload, "homeTitle") || hasOwn(payload, "homeDescription")) {
        await upsertSeoPage(connection, "home", {
          title: hasOwn(payload, "homeTitle") ? payload.homeTitle : currentSeo.pages.home?.title ?? "",
          description: hasOwn(payload, "homeDescription")
            ? payload.homeDescription
            : currentSeo.pages.home?.description ?? ""
        });
      }

      if (payload.pages && typeof payload.pages === "object") {
        for (const [routeKey, page] of Object.entries(payload.pages)) {
          const currentPage = currentSeo.pages[routeKey] ?? { title: "", description: "" };
          await upsertSeoPage(connection, routeKey, {
            title: hasOwn(page, "title") ? page.title : currentPage.title,
            description: hasOwn(page, "description") ? page.description : currentPage.description
          });
        }
      }

      if (payload.schema && typeof payload.schema === "object") {
        const record = {};
        if (hasOwn(payload.schema, "organizationName")) {
          record.organization_name = String(payload.schema.organizationName ?? "").trim();
        }
        if (hasOwn(payload.schema, "websiteName")) {
          record.website_name = String(payload.schema.websiteName ?? "").trim();
        }
        if (hasOwn(payload.schema, "siteUrl")) {
          record.site_url = String(payload.schema.siteUrl ?? "").trim();
        }
        if (hasOwn(payload.schema, "logo")) {
          record.logo_path = emptyToNull(payload.schema.logo);
        }
        if (hasOwn(payload.schema, "defaultImage")) {
          record.default_image_path = emptyToNull(payload.schema.defaultImage);
        }
        if (hasOwn(payload.schema, "sameAs")) {
          record.same_as_json = JSON.stringify(Array.isArray(payload.schema.sameAs) ? payload.schema.sameAs : []);
        }
        await updateSingletonRow(connection, "seo_schema_settings", record);
      }
    }

    if (section === "settings") {
      const record = {};
      if (hasOwn(payload, "footerYear")) record.footer_year = String(payload.footerYear ?? "").trim();
      if (hasOwn(payload, "domain")) record.domain = String(payload.domain ?? "").trim();
      if (hasOwn(payload, "headerLogo")) record.header_logo_path = emptyToNull(payload.headerLogo);
      await updateSingletonRow(connection, "site_settings", record);

      if (hasOwn(payload, "companyLogo")) {
        await updateSingletonRow(connection, "seo_schema_settings", {
          logo_path: emptyToNull(payload.companyLogo)
        });
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return getSingletonSection(section);
}

export async function listCollection(section) {
  assertArraySection(section);
  const pool = getMysqlPool();
  return fetchCollectionRows(pool, section);
}

export async function createCollectionItem(section, payload) {
  assertArraySection(section);
  const pool = getMysqlPool();
  const connection = await pool.getConnection();
  const config = sectionConfig[section];
  const id = payload.id ?? createEntityId(config.idPrefix);
  const record = mapSectionPayload(section, payload);

  try {
    await connection.beginTransaction();

    if (config.orderable) {
      const row = await queryOne(
        connection,
        `SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextSort FROM ${config.table}`
      );
      record.sort_order = Number(row?.nextSort ?? 1);
      record.is_active = hasOwn(record, "is_active") ? record.is_active : 1;
    }

    if (!config.orderable && !hasOwn(record, "created_at")) {
      record.created_at = toMysqlDateTime();
    }

    const columns = ["id", ...Object.keys(record)];
    const placeholders = columns.map(() => "?");
    await connection.query(
      `INSERT INTO ${config.table} (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`,
      [id, ...Object.values(record)]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return fetchSectionRow(pool, section, id);
}

export async function updateCollectionItem(section, id, payload) {
  assertArraySection(section);
  const pool = getMysqlPool();
  const connection = await pool.getConnection();
  const config = sectionConfig[section];

  try {
    await connection.beginTransaction();
    const existing = await queryOne(connection, `SELECT id FROM ${config.table} WHERE id = ? LIMIT 1`, [id]);

    if (!existing) {
      throw createHttpError(404, `${section.slice(0, -1)} not found`);
    }

    const record = mapSectionPayload(section, payload);
    const entries = Object.entries(record);

    if (entries.length) {
      const assignments = entries.map(([column]) => `${column} = ?`);
      await connection.query(
        `UPDATE ${config.table} SET ${assignments.join(", ")} WHERE id = ?`,
        [...entries.map(([, value]) => value), id]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return fetchSectionRow(pool, section, id);
}

export async function deleteCollectionItem(section, id) {
  assertArraySection(section);
  const pool = getMysqlPool();
  const { table } = sectionConfig[section];
  const [result] = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);

  if (!result.affectedRows) {
    throw createHttpError(404, `${section.slice(0, -1)} not found`);
  }

  return { success: true };
}

export async function reorderCollection(section, { fromIndex, toIndex, orderedIds }) {
  assertArraySection(section);
  const config = sectionConfig[section];

  if (!config.orderable) {
    throw createHttpError(400, `${section} do not support manual reordering.`);
  }

  const currentItems = await listCollection(section);
  let nextOrder = currentItems.map((item) => item.id);

  if (Array.isArray(orderedIds) && orderedIds.length === currentItems.length) {
    nextOrder = orderedIds;
  } else {
    const safeFrom = Number(fromIndex);
    const safeTo = Number(toIndex);

    if (Number.isNaN(safeFrom) || Number.isNaN(safeTo)) {
      throw createHttpError(400, "Provide either orderedIds or valid fromIndex/toIndex values.");
    }

    if (safeFrom < 0 || safeFrom >= currentItems.length) {
      throw createHttpError(400, "fromIndex is out of range.");
    }

    const boundedTo = Math.max(0, Math.min(safeTo, currentItems.length - 1));
    const reordered = [...nextOrder];
    const [moved] = reordered.splice(safeFrom, 1);
    reordered.splice(boundedTo, 0, moved);
    nextOrder = reordered;
  }

  const reorderPool = getMysqlPool();
  const reorderConnection = await reorderPool.getConnection();

  try {
    await reorderConnection.beginTransaction();

    for (const [index, itemId] of nextOrder.entries()) {
      await reorderConnection.query(
        `UPDATE ${config.table} SET sort_order = ? WHERE id = ?`,
        [index + 1, itemId]
      );
    }

    await reorderConnection.commit();
  } catch (error) {
    await reorderConnection.rollback();
    throw error;
  } finally {
    reorderConnection.release();
  }

  return listCollection(section);
}

export async function getDashboardSummary() {
  const pool = getMysqlPool();
  const [totalsRows] = await pool.query(
    `SELECT
      (SELECT COUNT(*) FROM projects) AS projects,
      (SELECT COUNT(*) FROM clients) AS clients,
      (SELECT COUNT(*) FROM testimonials) AS testimonials,
      (SELECT COUNT(*) FROM leads) AS leads`
  );
  const [stageRows] = await pool.query(
    "SELECT stage, COUNT(*) AS count FROM leads GROUP BY stage ORDER BY stage ASC"
  );
  const [latestLeadRows] = await pool.query(
    "SELECT * FROM leads ORDER BY created_at DESC, id DESC LIMIT 5"
  );

  return {
    totals: {
      projects: Number(totalsRows[0]?.projects ?? 0),
      clients: Number(totalsRows[0]?.clients ?? 0),
      testimonials: Number(totalsRows[0]?.testimonials ?? 0),
      leads: Number(totalsRows[0]?.leads ?? 0)
    },
    leadStages: Object.fromEntries(stageRows.map((row) => [row.stage ?? "New", Number(row.count ?? 0)])),
    latestLeads: latestLeadRows.map(mapLeadRow),
    updatedAt: await getLatestUpdatedAt(pool)
  };
}

export async function createPublicLead(payload) {
  const requiredFields = ["name", "company", "email", "phone", "requirement"];

  for (const field of requiredFields) {
    if (!payload[field] || !String(payload[field]).trim()) {
      throw createHttpError(400, `${field} is required.`);
    }
  }

  return createCollectionItem("leads", {
    name: String(payload.name).trim(),
    company: String(payload.company).trim(),
    email: String(payload.email).trim(),
    phone: String(payload.phone).trim(),
    requirement: String(payload.requirement).trim(),
    stage: "New",
    createdAt: nowIso()
  });
}

export async function listSocialLinks() {
  const pool = getMysqlPool();
  return fetchSocialLinks(pool);
}

export async function createSocialLink(payload) {
  const pool = getMysqlPool();
  const connection = await pool.getConnection();
  const id = payload.id ?? createEntityId("social");
  const record = mapSocialPayload(payload);

  try {
    await connection.beginTransaction();
    const row = await queryOne(
      connection,
      "SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextSort FROM social_links"
    );
    record.sort_order = Number(row?.nextSort ?? 1);
    record.is_active = hasOwn(record, "is_active") ? record.is_active : 1;

    const columns = ["id", ...Object.keys(record)];
    const placeholders = columns.map(() => "?");
    await connection.query(
      `INSERT INTO social_links (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`,
      [id, ...Object.values(record)]
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const row = await queryOne(pool, "SELECT * FROM social_links WHERE id = ? LIMIT 1", [id]);
  return mapSocialRow(row);
}

export async function updateSocialLink(id, payload) {
  const pool = getMysqlPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const existing = await queryOne(connection, "SELECT id FROM social_links WHERE id = ? LIMIT 1", [id]);

    if (!existing) {
      throw createHttpError(404, "Social link not found");
    }

    const record = mapSocialPayload(payload);
    const entries = Object.entries(record);

    if (entries.length) {
      const assignments = entries.map(([column]) => `${column} = ?`);
      await connection.query(
        `UPDATE social_links SET ${assignments.join(", ")} WHERE id = ?`,
        [...entries.map(([, value]) => value), id]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const row = await queryOne(pool, "SELECT * FROM social_links WHERE id = ? LIMIT 1", [id]);
  return mapSocialRow(row);
}

export async function deleteSocialLink(id) {
  const pool = getMysqlPool();
  const [result] = await pool.query("DELETE FROM social_links WHERE id = ?", [id]);

  if (!result.affectedRows) {
    throw createHttpError(404, "Social link not found");
  }

  return { success: true };
}

export async function reorderSocialLinks({ fromIndex, toIndex, orderedIds }) {
  const currentItems = await listSocialLinks();
  let nextOrder = currentItems.map((item) => item.id);

  if (Array.isArray(orderedIds) && orderedIds.length === currentItems.length) {
    nextOrder = orderedIds;
  } else {
    const safeFrom = Number(fromIndex);
    const safeTo = Number(toIndex);

    if (Number.isNaN(safeFrom) || Number.isNaN(safeTo)) {
      throw createHttpError(400, "Provide either orderedIds or valid fromIndex/toIndex values.");
    }

    if (safeFrom < 0 || safeFrom >= currentItems.length) {
      throw createHttpError(400, "fromIndex is out of range.");
    }

    const boundedTo = Math.max(0, Math.min(safeTo, currentItems.length - 1));
    const reordered = [...nextOrder];
    const [moved] = reordered.splice(safeFrom, 1);
    reordered.splice(boundedTo, 0, moved);
    nextOrder = reordered;
  }

  const pool = getMysqlPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const [index, id] of nextOrder.entries()) {
      await connection.query("UPDATE social_links SET sort_order = ? WHERE id = ?", [index + 1, id]);
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return listSocialLinks();
}

export async function getRouteSeo(routeKey) {
  const pool = getMysqlPool();
  const row = await queryOne(
    pool,
    "SELECT meta_title, meta_description FROM seo_pages WHERE route_key = ? LIMIT 1",
    [routeKey]
  );

  if (!row) {
    return null;
  }

  return {
    title: row.meta_title ?? "",
    description: row.meta_description ?? ""
  };
}
