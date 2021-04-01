#!/bin/bash

echo What should be the version?
read VERSION

docker build -t nazeeh2000/devdit:$VERSION .
docker push nazeeh2000/devdit:$VERSION

ssh root@139.59.95.86  "docker pull nazeeh2000/devdit:$VERSION && docker tag nazeeh2000/devdit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"