#!/bin/bash
typeorm-model-generator -h localhost -d smart_attendance -u root -x "" -e mysql -o /tmp/
mv /tmp/entities/* ./src/entity