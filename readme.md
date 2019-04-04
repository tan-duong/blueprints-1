# Development and submission workflow

## Creating blueprint

- clone/fork this repository
- `lerna create`

> Lerna exist in dev dependencies, binary command can be accessed locally in scope.

> fish:
- `eval npm bin lerna`
- `eval yarn bin lerna`
- `./node_modules/.bin/lerna`

> bash/zsh
- $(npm bin)/lerna
- $(yarn bin lerna)
- ./node_modules/.bin/lerna


## Plugin project structure

[ignite-cli plugin creation reference](https://github.com/infinitered/ignite/blob/master/docs/advanced-guides/creating-plugins.md)

For a project to be considered a blueprint, it has to include following files:

### plugin.js

*Proposal to rename `plugin.js` to `blueprint.js` to better reflect company's terminology.*

Have some resemblance with database migration workflow, where you have up and own migration and a history of applied migrations.

- npm module declaration
- add function
- remove function

### templates directory

Used to keep files that should be copied over the

## Submitting blueprint

- submit pull request
- publish to npm registry (done by maintainer)
- update dashboard registry (done by core team)

## Installing blueprint

### From dashboard (Proposal)

- select blueprint from dashboard
- provide configuration options

### From dev perspective (Manual)

- install botics-cli npm package
- attach botics to project (if thats not done already)
- issue `botics add plugin` command to project directory

Botics command line interface is forked and adapted for our needs from [ignite-cli](https://github.com/infinitered/ignite)
