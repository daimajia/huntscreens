import { index, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user";
import { producthunt, yc, indiehackers, taaft, Producthunt, YC, Taaft, IndieHackers } from ".";
import { relations } from "drizzle-orm";

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  itemId: uuid('item_id').notNull(),
  itemType: text('item_type').notNull(),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => {
  return {
    userIdIndex: index('user_id_index').on(table.userId),
    itemIdIndex: index('item_id_index').on(table.itemId),
    itemTypeIndex: index('item_type_index').on(table.itemType),
    createdAtIndex: index('created_at_index').on(table.createdAt),
    userItemIndex: index('user_item_index').on(table.userId, table.itemId)
  }
});

export type Favorites = typeof favorites.$inferSelect;
export type NewFavorites = typeof favorites.$inferInsert;

export type FavoritesWithDetail = Favorites & {
  ph: Producthunt | null,
  yc: YC | null,
  taaft: Taaft | null,
  indiehackers: IndieHackers | null
}

export const userFavoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  ph: one(producthunt, {
    fields: [favorites.itemId],
    references: [producthunt.uuid],
    relationName: 'productHuntFavorite',
  }),
  yc: one(yc, {
    fields: [favorites.itemId],
    references: [yc.uuid],
    relationName: 'ycFavorite',
  }),
  taaft: one(taaft, {
    fields: [favorites.itemId],
    references: [taaft.uuid],
    relationName: 'taaftFavorite',
  }),
  indiehackers: one(indiehackers, {
    fields: [favorites.itemId],
    references: [indiehackers.uuid],
    relationName: 'indiehackersFavorite',
  }),
}));