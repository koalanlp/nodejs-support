#!/bin/bash

extract_version()
{
    LIB_VER=$(cat package.json | grep "version\": " | cut -d\" -f4 | cut -d- -f1)
    LIB_VER_MAJOR=$(echo $LIB_VER | cut -d. -f1)
    LIB_VER_MINOR=$(echo $LIB_VER | cut -d. -f2)
    LIB_VER_INCRM=$(echo $LIB_VER | cut -d. -f3)
    LIB_VER_CURRENT=$LIB_VER_MAJOR.$LIB_VER_MINOR.$LIB_VER_INCRM
}

add_incremental_ver()
{
    LIB_VER_NEXT=$LIB_VER_MAJOR.$LIB_VER_MINOR.$(($LIB_VER_INCRM + 1))
}

add_minor_ver()
{
    LIB_VER_NEXT=$LIB_VER_MAJOR.$(( $LIB_VER_MINOR + 1)).0
}

set_version()
{
    cat package.json | sed -e "s/version\":\s*\".*\"/version\": \"$1\"/g" > package.json.new
    rm package.json
    mv package.json.new package.json
    git add package.json
}

ask_proceed()
{
    read -p "Proceed $1 [Y/n/p]? " YN
    if [ "${YN,,}" = "n" ]; then
        exit 0
    fi
}

extract_version
echo $LIB_VER_CURRENT

ask_proceed "Set Version"
if [ "${YN,,}" != "p" ]; then
    read -p "Incrementally increase version [Y/n]? " YN
    if [ "${YN,,}" == "y" ]; then
        add_incremental_ver
    else
        add_minor_ver
    fi
    set_version $LIB_VER_NEXT
fi

ask_proceed "Documentation"
if [ "${YN,,}" != "p" ]; then
    npm run jsdoc
fi

ask_proceed "Compile to CommonJS"
if [ "${YN,,}" != "p" ]; then
    npm run compile
fi

ask_proceed "Test"
if [ "${YN,,}" != "p" ]; then
    npm run test
fi

ask_proceed "Commit"
if [ "${YN,,}" != "p" ]; then
    git add docs/
    git add -u
    git add -i
    git commit
fi

ask_proceed "Publish"
if [ "${YN,,}" != "p" ]; then
    npm publish
    git tag v$LIB_VER_NEXT
fi

ask_proceed "Push"
if [ "${YN,,}" != "p" ]; then
    git push --all
    git push --tags
fi