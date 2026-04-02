SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(190) NOT NULL,
  `username` VARCHAR(80) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'admin',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_users_email` (`email`),
  UNIQUE KEY `uq_admin_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `home_content` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `hero_title` VARCHAR(255) NOT NULL,
  `hero_subtitle` VARCHAR(255) NOT NULL,
  `cta_primary` VARCHAR(120) NOT NULL,
  `cta_secondary` VARCHAR(120) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `projects` (
  `id` VARCHAR(120) NOT NULL,
  `name` VARCHAR(190) NOT NULL,
  `capacity` VARCHAR(120) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Published',
  `direction` ENUM('left', 'right') NOT NULL DEFAULT 'left',
  `image_path` VARCHAR(500) DEFAULT NULL,
  `company_logo_path` VARCHAR(500) DEFAULT NULL,
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_projects_sort_order` (`sort_order`),
  KEY `idx_projects_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `clients` (
  `id` VARCHAR(120) NOT NULL,
  `company_name` VARCHAR(190) NOT NULL,
  `category` VARCHAR(120) DEFAULT NULL,
  `year` VARCHAR(20) DEFAULT NULL,
  `capacity` VARCHAR(120) DEFAULT NULL,
  `company_logo_path` VARCHAR(500) DEFAULT NULL,
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_clients_sort_order` (`sort_order`),
  KEY `idx_clients_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` VARCHAR(120) NOT NULL,
  `title` VARCHAR(190) NOT NULL,
  `subtitle` VARCHAR(190) DEFAULT NULL,
  `tag` VARCHAR(120) DEFAULT NULL,
  `capacity` VARCHAR(120) DEFAULT NULL,
  `installed` VARCHAR(20) DEFAULT NULL,
  `description` TEXT NOT NULL,
  `image_path` VARCHAR(500) DEFAULT NULL,
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_testimonials_sort_order` (`sort_order`),
  KEY `idx_testimonials_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `leads` (
  `id` VARCHAR(120) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `company` VARCHAR(190) DEFAULT NULL,
  `email` VARCHAR(190) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `requirement` TEXT DEFAULT NULL,
  `stage` VARCHAR(50) NOT NULL DEFAULT 'New',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_leads_stage` (`stage`),
  KEY `idx_leads_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contact_settings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `phone` VARCHAR(30) DEFAULT NULL,
  `email` VARCHAR(190) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `linkedin_url` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `social_links` (
  `id` VARCHAR(120) NOT NULL,
  `platform` VARCHAR(100) NOT NULL,
  `handle` VARCHAR(150) DEFAULT NULL,
  `url` VARCHAR(500) NOT NULL,
  `logo_path` VARCHAR(500) DEFAULT NULL,
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_social_links_sort_order` (`sort_order`),
  KEY `idx_social_links_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `seo_pages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `route_key` VARCHAR(50) NOT NULL,
  `meta_title` VARCHAR(255) NOT NULL,
  `meta_description` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_seo_pages_route_key` (`route_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `seo_schema_settings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `organization_name` VARCHAR(190) NOT NULL,
  `website_name` VARCHAR(190) NOT NULL,
  `site_url` VARCHAR(500) NOT NULL,
  `logo_path` VARCHAR(500) DEFAULT NULL,
  `default_image_path` VARCHAR(500) DEFAULT NULL,
  `same_as_json` LONGTEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `footer_year` VARCHAR(10) NOT NULL,
  `domain` VARCHAR(500) NOT NULL,
  `header_logo_path` VARCHAR(500) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `media_assets` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `mime_type` VARCHAR(120) NOT NULL,
  `file_size` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `uploaded_by` BIGINT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_media_assets_uploaded_by` (`uploaded_by`),
  CONSTRAINT `fk_media_assets_uploaded_by`
    FOREIGN KEY (`uploaded_by`) REFERENCES `admin_users` (`id`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_user_id` BIGINT UNSIGNED NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `expires_at` DATETIME NOT NULL,
  `revoked_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_sessions_token_hash` (`token_hash`),
  KEY `idx_admin_sessions_admin_user_id` (`admin_user_id`),
  KEY `idx_admin_sessions_expires_at` (`expires_at`),
  CONSTRAINT `fk_admin_sessions_admin_user`
    FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `home_content` (`hero_title`, `hero_subtitle`, `cta_primary`, `cta_secondary`)
SELECT
  "India's Trusted Turnkey EPC Partner",
  "Solar, HVAC & Industrial Utilities",
  "Explore Our Projects",
  "Get a Free Feasibility Report"
WHERE NOT EXISTS (
  SELECT 1 FROM `home_content`
);

INSERT INTO `contact_settings` (`phone`, `email`, `address`, `linkedin_url`)
SELECT
  '09998112299',
  'info@environomics.in',
  '417 Ratna High Street, Naranpura, Ahmedabad, 380013, Gujarat, India',
  'https://www.linkedin.com/company/environomics-projects-llp/'
WHERE NOT EXISTS (
  SELECT 1 FROM `contact_settings`
);

INSERT INTO `social_links` (`id`, `platform`, `handle`, `url`, `logo_path`, `sort_order`, `is_active`)
SELECT
  'social_linkedin',
  'LinkedIn',
  '@environomics-projects-llp',
  'https://www.linkedin.com/company/environomics-projects-llp/',
  NULL,
  1,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM `social_links` WHERE `id` = 'social_linkedin'
);

INSERT INTO `seo_pages` (`route_key`, `meta_title`, `meta_description`)
SELECT * FROM (
  SELECT 'home' AS `route_key`, 'Turnkey Solar, HVAC & Industrial EPC in India' AS `meta_title`, 'Environomics Projects LLP delivers turnkey EPC solutions across solar power, HVAC, clean rooms, electrification, automation, and industrial utilities in India.' AS `meta_description`
  UNION ALL
  SELECT 'about', 'About Environomics', 'Learn about Environomics Projects LLP, our EPC process, engineering approach, leadership, and experience delivering industrial infrastructure projects across India.'
  UNION ALL
  SELECT 'services', 'Solar EPC, HVAC and Industrial Utility Services', 'Discover Environomics services spanning solar rooftop, ground mount plants, O&M, pharmaceutical clean rooms, electrification, automation, and energy audits.'
  UNION ALL
  SELECT 'projects', 'Industrial EPC Projects Portfolio', 'Explore Environomics project work across rooftop solar, ground mount systems, industrial HVAC, and utility infrastructure for leading commercial and industrial clients.'
  UNION ALL
  SELECT 'clients', 'Clients and Installation Portfolio', 'See the clients who trust Environomics for solar EPC, industrial utilities, HVAC, and long-term infrastructure execution across multiple sectors in India.'
  UNION ALL
  SELECT 'testimonials', 'Client Testimonials', 'Read client testimonials and proof points from Environomics solar EPC and industrial infrastructure projects delivered for major brands and manufacturers.'
  UNION ALL
  SELECT 'innovation', 'Innovation and R&D', 'Explore Environomics innovation initiatives, proprietary solar engineering work, R&D programs, and industrial infrastructure technology development.'
  UNION ALL
  SELECT 'contact', 'Contact Environomics', 'Contact Environomics Projects LLP for solar EPC, industrial HVAC, clean rooms, automation, electrification, and feasibility assessments for your facility.'
) AS `seed`
WHERE NOT EXISTS (
  SELECT 1 FROM `seo_pages`
);

INSERT INTO `seo_schema_settings` (`organization_name`, `website_name`, `site_url`, `logo_path`, `default_image_path`, `same_as_json`)
SELECT
  'Environomics Projects LLP',
  'Environomics',
  'https://environomics.in',
  '/imgs/LOGO (1).png',
  '/imgs/hero-2560.jpg',
  '["https://www.linkedin.com/company/environomics-projects-llp/"]'
WHERE NOT EXISTS (
  SELECT 1 FROM `seo_schema_settings`
);

INSERT INTO `site_settings` (`footer_year`, `domain`, `header_logo_path`)
SELECT
  '2026',
  'https://environomics.in',
  '/imgs/LOGO (1).png'
WHERE NOT EXISTS (
  SELECT 1 FROM `site_settings`
);

-- Create your first admin user after generating a password hash in the backend.
-- Example shape:
-- INSERT INTO `admin_users` (`name`, `email`, `username`, `password_hash`)
-- VALUES ('Admin', 'admin@example.com', 'admin', '<generated-password-hash>');
