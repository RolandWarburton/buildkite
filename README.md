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

## Downloading and Using Artifacts

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
      - run: node lib/src/index.js | tee output.log
        #  upload the log file  with the name "output" we use this name to refer to it later
      - uses: actions/upload-artifact@v3
        with:
          name: output
          path: output.log
  cat-log-file:
    runs-on: ubuntu-20.04
    # we can use "needs" to wait depend on another job
    needs: [run-js-action]
    steps:
        # download the log file using its special name that we gave it above
      - uses: actions/download-artifact@v3
        with:
          name: output
      - run: cat output.log
```

## Branch Protection

This allows a branch, such as master, to be protected through a PR-only merge policy,
as well as github actions to enable a branch to be in a passing state.

To enable branch protection - on the github website repo, go to settings, branches, then add a new branch rule.

My chosen settings were

* Require a pull request before merging
* Require status checks to pass before merging 
  * Require branches to be up to date before merging
  * Under the search box for "status checks" search for the name of a job in your workflows

I created a new workflow called `.github/workflows/on-pull-request.yaml` and added the following to it.

```yml
name: on-pull-request

on: ['pull_request', 'push']

jobs:
  run-test-action:
    runs-on: ubuntu-20.04
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 16
      # seperates this step for github actions (github displays this nicely in UI)
      - name: Install and run test
        working-directory: ./lib
        run: |
          npm install
          npm run test
```

Of course your repo needs to have the test script in package.json for this to work, and a relevant test suite.

Right now my test passes, you can choose to enable the failing test and observe how a PR will be refused when the test fails.

```js
// the foo function just returns the string 'foo'
import { foo } from '../foo';

describe('test suite', () => {
  it('test case', () => {
    expect(foo()).toBe('foo');
  });

  it.skip('test case that fails', () => {
    expect(foo()).toBe('bar');
  });
});
```
