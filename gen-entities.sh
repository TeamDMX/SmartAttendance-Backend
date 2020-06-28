#!/bin/bash
npx typeorm-model-generator -h localhost -d smartattendacne -u root -x "" -e mysql -o /tmp/
mv /tmp/entities/* ./src/entity