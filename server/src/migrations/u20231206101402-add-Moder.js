module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Users_role_temp" AS ENUM ('customer', 'creator', 'moder');
      ALTER TABLE "Users" ALTER COLUMN "role" TYPE "enum_Users_role_temp" USING "role"::text::"enum_Users_role_temp";
      DROP TYPE "enum_Users_role";
      ALTER TYPE "enum_Users_role_temp" RENAME TO "enum_Users_role";
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Users_role_temp" AS ENUM ('customer', 'creator');
      ALTER TABLE "Users" ALTER COLUMN "role" TYPE "enum_Users_role_temp" USING "role"::text::"enum_Users_role_temp";
      DROP TYPE "enum_Users_role";
      ALTER TYPE "enum_Users_role_temp" RENAME TO "enum_Users_role";
    `);
  },
};
