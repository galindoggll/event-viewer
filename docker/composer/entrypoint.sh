#!/bin/sh

set -e

if [ "$1" = 'ash' ]; then
  exec "$@"
  exit $?
fi

composer --version
exec php -d memory_limit=-1 `which composer` "$@"
