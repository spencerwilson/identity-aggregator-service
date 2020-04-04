# identity-aggregator-service

Welcome! ias (working name) is a JavaScript library to aggregate multiple sources of personal identity information into a single `GraphQLSchema`. Data sources are defined via ***provider*** plugins. Each provider defines the fields (and their resolvers) that it can contribute to a `Person` type—all of which are either scalars, a reference to a `Person`, or a list of references to `Person`s—and ias coalesces these into a single schema.

The project includes sample implementations of providers for

* Namely,
* Slack,
* GitHub,
* Jira,
* Optimizely, and
* the Coffee Klatch database.

Additionally, `example/` contains a simple Express service to get you up and running quickly. `npm run example` and open GraphiQL to explore a schema built with ias.

PRs welcome!

## Why? Use cases

* **Tooling.** Associate problematic commits in GitHub to an individual, assign them a JIRA ticket, and ping them on Slack.
* **Hackathon projects.** Company-wide _Guess Who_, Face Slide Maker, etc.
* **Identify and resolve discrepancies.** Email individuals with a personalized report of instances of missing or inconsistent information across the providers
* **Answer questions about your organization.** To whom does each member of my team report? What are the GitHub handles of everyone in a Slack group? These kinds of questions are in the realm of SQL queries against a data warehouse, but if your organization is not scraping that information or you don't care for SQL, this service is one alternative.

## How? Project goals

* **Minimally adequate providers.** Providers may have access to a lot of information, but the GraphQL types they expose should contain as few fields as are necessary to satisfy real use cases. This is motivated by GraphQL encouraging a "versionless" API, where we regard every field as a contract to be upheld in perpetuity. Introduce additional fields with caution and intention.
* **Easily extensible.** Adding your own providers should be simple. Check out `src/providers/` for examples. PRs welcome!
* **Minimal dependencies.** The project shall not have dependencies than aren't absolutely necessary. For example, I'm a fan of Rich Harris' module bundler, [Rollup](https://github.com/rollup/rollup), and I was tempted to use it so that this project could be written using native modules. However, to me, the burden of the dependency and added complexity of transpilation outweigh the benefit. The service is small, and that refactor can easily happen at a later date. Until Node.js learns how to consume native modules, we're stuck with CommonJS. Like _animals_, I know. Fewer dependencies also makes the project more approachable, as there are fewer potentially-unfamiliar things that might discourage would-be contributors.

## Running

From the repo root,

```sh
# Get the prescribed version of Node.js in your $PATH.
nvm install

# Install dependencies.
# `--no-optional` will exclude the dependencies needed for `npm run example` and sample providers.
npm install

# Start the example service, if you like.
npm run example
```

## Providers

A provider is n things:

* thing

## Design

Each of the schemas are coalesced together in some given precedence order. Somewhere, a clustering occurs to associate the data of the sources together, and to turn them into People nodes. The raw data is accessible still too, of course.

## Roadmap

* Figure out how/when to merge ids, and where that state lives
* Build in a read-through cache (a la a CDN edge node) for provider data (presumably state lives in same-ish place as person ids from each provider)
* Consider refactoring from JS type construction to using GraphQL SDL + a resolver file. Could merge IDLs into a single schema. Combine IDL files into a single `GraphQLSchema` instance,  use introspection to identify the keypaths that are to Person or PersonList, then wrap all fields' resolver like currently. Accomplishes next two items?
* Support non-flat provider `GraphQLFieldConfigMap`s.
* Support arbitrary node-sharing (not just `Person`)