-- DropForeignKey
ALTER TABLE "RolePermissions" DROP CONSTRAINT "RolePermissions_permissionId_fkey";

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
