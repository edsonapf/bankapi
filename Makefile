PROJECT := "FBank API"
DATABASE_NAME := "FBank DB"
SUDO := $(shell which sudo)
DATABASE := fbank
DATABASE_TEST := fbank_test

install: ;@echo "Installing ${PROJECT} dependencies and creating database....."; \
    npm install ; \
    $(SUDO) su postgres -c "psql -c \"CREATE DATABASE ${DATABASE};\"" ; \
    sequelize db:migrate

dev: ;@echo "Running ${PROJECT} in dev environment"; \
    npm start

build: ;@echo "Running ${PROJECT} in prod environment"; \
    npm run build

delete-tables: ;@echo "Deleting tables from ${DATABASE_NAME}"; \
    sequelize db:migrate:undo ; \
    sequelize db:migrate:undo ; \
    sequelize db:migrate:undo ; \
    sequelize db:migrate:undo

create-tables: ;@echo "Creating tables on ${DATABASE_NAME}"; \
    sequelize db:migrate

reset-db: ;@echo "Reseting ${PROJECT} database"; \
    $(SUDO) su postgres -c "psql -c \"DROP DATABASE ${DATABASE};\"" ; \
    $(SUDO) su postgres -c "psql -c \"CREATE DATABASE ${DATABASE};\"" ; \
    sequelize db:migrate

clean: ;@echo "Cleaning ${PROJECT} modules"; \
    rm -rf node_modules
