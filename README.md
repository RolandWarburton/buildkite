# Github Actions Experiment

Learning how to use GH actions.

## Not about multiple line run tasks

In `.github/workflows/test.yml` i was confused about how to run multiple commands in one run task.
You may do that like this, using the `>` or `|` operator:

```yaml
run: |
  ls ${{ github.workspace }}
```

The command needs to be indented directly 1 level out from the `run` command.

You can do multiple commands like this.

```yaml
run: |
  ls ${{ github.workspace }} && \
  echo "DONE"
```
