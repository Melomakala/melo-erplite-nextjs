-- CreateTable
CREATE TABLE "tbl_order" (
    "order_id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "grand_total" INTEGER NOT NULL DEFAULT 0,
    "create_by" TEXT NOT NULL,
    "update_by" TEXT DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "tbl_order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "tbl_customer" ("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbl_order_detail" (
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
    CONSTRAINT "tbl_order_detail_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "tbl_order" ("order_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbl_order_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tbl_product" ("product_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbl_customer" (
    "customer_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "status" TEXT NOT NULL,
    "create_by" TEXT NOT NULL,
    "update_by" TEXT DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_tbl_customer" ("address", "create_by", "created_at", "customer_id", "email", "name", "phone", "status", "update_by", "updated_at") SELECT "address", "create_by", "created_at", "customer_id", "email", "name", "phone", "status", "update_by", "updated_at" FROM "tbl_customer";
DROP TABLE "tbl_customer";
ALTER TABLE "new_tbl_customer" RENAME TO "tbl_customer";
CREATE TABLE "new_tbl_product" (
    "product_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "create_by" TEXT NOT NULL,
    "update_by" TEXT DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "tbl_product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "tbl_product_category" ("category_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tbl_product" ("category_id", "create_by", "created_at", "name", "price", "product_id", "status", "stock", "update_by", "updated_at") SELECT "category_id", "create_by", "created_at", "name", "price", "product_id", "status", "stock", "update_by", "updated_at" FROM "tbl_product";
DROP TABLE "tbl_product";
ALTER TABLE "new_tbl_product" RENAME TO "tbl_product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
