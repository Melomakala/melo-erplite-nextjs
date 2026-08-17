-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbl_order_detail" (
    "order_detail_id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "create_by" TEXT NOT NULL,
    "update_by" TEXT DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "tbl_order_detail_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "tbl_order" ("order_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tbl_order_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tbl_product" ("product_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tbl_order_detail" ("create_by", "created_at", "order_detail_id", "order_id", "price", "product_id", "quantity", "total", "update_by", "updated_at") SELECT "create_by", "created_at", "order_detail_id", "order_id", "price", "product_id", "quantity", "total", "update_by", "updated_at" FROM "tbl_order_detail";
DROP TABLE "tbl_order_detail";
ALTER TABLE "new_tbl_order_detail" RENAME TO "tbl_order_detail";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
