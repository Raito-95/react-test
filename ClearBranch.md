# Clearing the gh-pages Branch History

## Purpose
To delete all historical records from the `gh-pages` branch except for the latest commit, leaving the branch with only the most recent commit.

## Steps

### 1. Switch to the `gh-pages` Branch and Create a Temporary Branch
First, switch to your `gh-pages` branch and then create a new temporary branch pointing to the current latest commit:

```bash
git checkout gh-pages
git checkout -b temp-branch
```

### 2. Delete the Original gh-pages Branch
Delete the local gh-pages branch:

```bash
git branch -D gh-pages
```

### 3. Create a New gh-pages Branch
Create a new gh-pages branch using the --orphan option, which starts a new branch without any historical records:

```bash
git checkout --orphan gh-pages
git commit -m "Retain only the latest commit"
```

This commit will become the first commit on the new gh-pages branch and the branch will not contain any other historical records.

### 4. Force Push Changes to the Remote
Force push the local changes to the GitHub gh-pages branch to update the remote branch history:

```bash
git push origin gh-pages --force
```

### Considerations
Data Backup: Before proceeding with the above steps, ensure all necessary data is backed up. This process will permanently delete the old history of the gh-pages branch.
Risk: Force pushing (--force) rewrites the history of the remote branch. This operation is destructive and should be used with caution.
By following these steps, you can effectively clean up the history of the gh-pages branch, retaining only the most recent commit.