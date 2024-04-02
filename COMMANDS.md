# To generate a module with a controller and a service

nest g module users
nest g controller users
nest g service users

# Migrations

npm run typeorm migration:create ./migrations/<migration_file_name> -o <!-- Empty file gets created -->
npm run typeorm migration:generate ./migrations/<migration_file_name> -- -d ./datasource.config.js -o
npm run typeorm migration:run -- -d ./datasource.config.js
