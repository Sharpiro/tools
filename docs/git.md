# Git

## diff file with working

```sh
git diff ef5d00179b812df10a3f2e7b7ca5ac8a6e26f732 -- test_client/config
```

## get Log Count

```sh
git rev-list --count master
```

## interactive amend commit

```sh
git rebase -i aabbccff
# select 'e' to edit every affected commit

# amend the author for each commit
git commit --amend --author="sharpiro <dsharpbb09@gmail.com>"

# continue through each selected commit
git rebase --continue
```

## log pretty

```sh
git log --pretty=format:"%h - %ae, %ce : %s" -1
```

## move folder to new repository

```sh
git filter-branch --subdirectory-filter <directory 1> -- --all
```

## remove file from history

```sh
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch sniffing_proxy/test_client/config' \
--prune-empty --tag-name-filter cat -- --all

```

## remove folder from history

```sh
git filter-branch --tree-filter 'rm -rf sniffing_proxy' --prune-empty HEAD
```
