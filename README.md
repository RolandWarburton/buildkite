# Github Actions Experiment

Learning how to use GH actions.

## Note about multiple line run tasks

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

## Creating a Simple Node Workflow

This workflow runs some javascript code.

```yaml
name: Test

on: ['push']

jobs:
  run-js-action:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 16
      - run: node lib/src/index.js
```

## Saving Artifacts

Artifacts can be written to the disk in the magical workflow space and then uploaded to be accessed as a downloadable artifact from the github website.

```yaml
name: Test

on: ['push']

jobs:
  # i recycled the node job above
  run-js-action:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 16
        # here i tee the output to a log file, then call the upload-artifact action
      - run: node lib/src/index.js | tee output.log
      - uses: actions/upload-artifact@v3
        with:
          name: output-log-file
          path: output.log

```