set -e
echo "Enter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  # run tests
  yarn test 2>/dev/null

  # build
  VERSION=$VERSION yarn build

  # commit
  read -p "Enter commit message:" MSG

  git add -A
  git commit -m "$MSG"
  yarn version $VERSION --message "[release] $VERSION"

  # publish
  git push origin refs/tags/v$VERSION
  git push
  yarn publish
fi
