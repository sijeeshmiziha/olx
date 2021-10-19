/**
 * Lazy migration helpers for existing Firestore docs missing new schema fields.
 * @module firebase/migration
 */
export { migrateUserDoc } from './userMigration';
export { migrateProductDoc } from './productMigration';
