import { env } from "../config/env.js";
import * as jsonContentStore from "./jsonContentStore.js";
import * as mysqlContentStore from "./mysqlContentStore.js";

function getStore() {
  return env.storageDriver === "mysql" ? mysqlContentStore : jsonContentStore;
}

export function initializeContentStorage() {
  return getStore().initialize();
}

export function getContent() {
  return getStore().getContent();
}

export function getPublicContent() {
  return getStore().getPublicContent();
}

export function resetContent() {
  return getStore().resetContent();
}

export function getSingletonSection(section) {
  return getStore().getSingletonSection(section);
}

export function updateSingletonSection(section, payload) {
  return getStore().updateSingletonSection(section, payload);
}

export function listCollection(section) {
  return getStore().listCollection(section);
}

export function createCollectionItem(section, payload) {
  return getStore().createCollectionItem(section, payload);
}

export function updateCollectionItem(section, id, payload) {
  return getStore().updateCollectionItem(section, id, payload);
}

export function deleteCollectionItem(section, id) {
  return getStore().deleteCollectionItem(section, id);
}

export function reorderCollection(section, payload) {
  return getStore().reorderCollection(section, payload);
}

export function getDashboardSummary() {
  return getStore().getDashboardSummary();
}

export function createPublicLead(payload) {
  return getStore().createPublicLead(payload);
}

export function listSocialLinks() {
  return getStore().listSocialLinks();
}

export function createSocialLink(payload) {
  return getStore().createSocialLink(payload);
}

export function updateSocialLink(id, payload) {
  return getStore().updateSocialLink(id, payload);
}

export function deleteSocialLink(id) {
  return getStore().deleteSocialLink(id);
}

export function reorderSocialLinks(payload) {
  return getStore().reorderSocialLinks(payload);
}

export function getRouteSeo(routeKey) {
  return getStore().getRouteSeo(routeKey);
}
