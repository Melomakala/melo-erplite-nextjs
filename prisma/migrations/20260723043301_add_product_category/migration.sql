/*
  Warnings:

  - The primary key for the `tbl_user_account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `tbl_user_account` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `tbl_user_account` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tbl_user_account` table. All the data in the column will be lost.
  - The primary key for the `tbl_user_session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `tbl_user_session` table. All the data in the column will be lost.
  - You are about to drop the column `expires` on the `tbl_user_session` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `tbl_user_session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `tbl_user_session` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `tbl_user_session` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `tbl_user_account` table without a default value. This is not possible if the table is not empty.
  - The required column `user_id` was added to the `tbl_user_account` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `expires_at` to the `tbl_user_session` table without a default value. This is not possible if the table is not empty.
  - The required column `session_id` was added to the `tbl_user_session` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `session_token` to the `tbl_user_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `tbl_user_session` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "tbl_product_category" (
    "category_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "create_by" TEXT NOT NULL,
    "update_by" TEXT DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tbl_product" (
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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbl_user_account" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_tbl_user_account" ("name", "password", "role", "username") SELECT "name", "password", "role", "username" FROM "tbl_user_account";
DROP TABLE "tbl_user_account";
ALTER TABLE "new_tbl_user_account" RENAME TO "tbl_user_account";
CREATE UNIQUE INDEX "tbl_user_account_username_key" ON "tbl_user_account"("username");
CREATE TABLE "new_tbl_user_session" (
    "session_id" TEXT NOT NULL PRIMARY KEY,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tbl_user_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbl_user_account" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);
DROP TABLE "tbl_user_session";
ALTER TABLE "new_tbl_user_session" RENAME TO "tbl_user_session";
CREATE UNIQUE INDEX "tbl_user_session_session_token_key" ON "tbl_user_session"("session_token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
