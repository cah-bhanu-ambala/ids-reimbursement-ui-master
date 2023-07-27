#!/bin/bash
set -Eeuvxo pipefail

APP_NAME=$(ng config defaultProject)
DEPLOY_ARTIFACT=$PWD/$APP_NAME.zip
OUTPUT_DIR=$(ng config projects.$APP_NAME.architect.build.options.outputPath)
rm -r "$OUTPUT_DIR"
[[ -f "$DEPLOY_ARTIFACT" ]] && rm "$DEPLOY_ARTIFACT"
ng b --prod=true --preserve-symlinks
NGINX_ROOT=$(basename ./$OUTPUT_DIR)
[[ -n "$OUTPUT_DIR" ]] && pushd $OUTPUT_DIR/..
zip -r "$DEPLOY_ARTIFACT" ./$NGINX_ROOT
[[ -n "$OUTPUT_DIR" ]] && popd
# This adds nginx-buildpack specific files to the binary
pushd buildpack-content
if [ -f "deployment-includes.txt" ]; then
  echo "Adding selective buildpack content"
  7z a -tzip "$DEPLOY_ARTIFACT" @deployment-includes.txt
else
  echo "Adding all buildpack content"
  zip -r "$DEPLOY_ARTIFACT" ./*
fi
echo "Artifact ready for deployment"
popd
#cf push -f manifest-dev.yml -p $DEPLOY_ARTIFACT
