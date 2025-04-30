# Clearing the `gh-pages` Branch History

## Purpose
To delete all historical records from the `gh-pages` branch and retain **only the most recent commit**, effectively replacing the branch history with a single clean commit. This is useful when publishing static sites via GitHub Pages and you want to simplify or reduce branch history size.

---

## Steps

### 1. Backup the Current `gh-pages` Branch
To ensure safety, create a local backup of the current `gh-pages` branch:

```bash
git branch backup-gh-pages
```

> This creates a backup pointer to the current state of `gh-pages` in case something goes wrong.

---

### 2. Create a Temporary Branch to Store Latest Files
Create a temporary branch to preserve the content from the latest commit:

```bash
git checkout gh-pages
git checkout -b temp-branch
```

> This branch is used to restore your latest files after resetting `gh-pages`.

---

### 3. Start a New Clean `gh-pages` Branch (No History)
Create an **orphan** branch named `gh-pages`, which will have no prior commit history:

```bash
git checkout --orphan gh-pages
```

> The orphan branch keeps the same name but starts fresh with zero commit history.

---

### 4. Restore Files and Make a Clean Commit
Reset the working directory, restore files from the temporary branch, and commit:

```bash
git reset --hard
git checkout temp-branch -- .
git add .
git commit -m "Retain only the latest commit"
```

> This creates a clean commit with only the latest state of the files.

---

### 5. Force Push to Overwrite Remote `gh-pages`
Force push to replace the remote `gh-pages` branch with the new clean history:

```bash
git push origin gh-pages --force
```

> This will completely **overwrite** the remote `gh-pages` history.  
> It **does not** create a new remote branch — it replaces the existing one.

---

### 6. (Optional) Delete Temporary and Backup Branches
After verifying the remote is correct, you can safely delete the local helper branches:

```bash
git branch -D temp-branch
git branch -D backup-gh-pages
```

---

## Considerations

1. **Verify Data Integrity**  
   Ensure that the new `gh-pages` branch contains all necessary files before pushing.

2. **Always Backup First**  
   Keeping a backup branch like `backup-gh-pages` gives you a quick way to restore if anything goes wrong.

3. **Use `--force` with Caution**  
   Force pushing rewrites history. Ensure collaborators are aware and synced.

---

