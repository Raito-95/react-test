# Clearing the gh-pages Branch History

## Purpose
To delete all historical records from the `gh-pages` branch except for the latest commit, leaving the branch with only the most recent commit.

---

## Steps

### 1. Backup the Current `gh-pages` Branch
To ensure safety, create a backup of the current `gh-pages` branch:

```bash
git branch backup-gh-pages
```

---

### 2. Create a Temporary Branch
Switch to the `gh-pages` branch and create a new temporary branch to store the latest commit:

```bash
git checkout gh-pages
git checkout -b temp-branch
```

---

### 3. Start a New `gh-pages` Branch
Create a new orphan branch for `gh-pages`, which will not retain any commit history:

```bash
git checkout --orphan gh-pages
```

---

### 4. Stage and Commit Files
In the new `gh-pages` branch, clean up all untracked files and stage the files you want to keep:

```bash
git reset --hard
git commit -m "Retain only the latest commit"
```

---

### 5. Force Push to the Remote `gh-pages` Branch
Force push the local `gh-pages` branch to overwrite the remote branch:

```bash
git push origin gh-pages --force
```

---

### 6. (Optional) Delete Temporary and Backup Branches
After verifying the remote `gh-pages` branch is updated correctly, you can delete the temporary and backup branches locally:

```bash
git branch -D temp-branch
git branch -D backup-gh-pages
```

---

## Considerations

1. **Verify Data Integrity**:
   Before committing, ensure the new `gh-pages` branch contains the correct files and content.

2. **Backup First**:
   Always create a backup branch before deleting history to prevent data loss.

3. **Use `--force` Cautiously**:
   Be aware that force pushing will completely overwrite the remote branch history. Ensure all collaborators are informed and in sync.
