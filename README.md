# 📦 crane-installer

[![CI](https://github.com/IAreKyleW00t/crane-installer/actions/workflows/ci.yml/badge.svg)](https://github.com/IAreKyleW00t/crane-installer/actions/workflows/ci.yml)
[![Tests](https://github.com/IAreKyleW00t/crane-installer/actions/workflows/test.yml/badge.svg)](https://github.com/IAreKyleW00t/crane-installer/actions/workflows/test.yml)
[![Check dist/](https://github.com/IAreKyleW00t/crane-installer/actions/workflows/check-dist.yml/badge.svg)](https://github.com/IAreKyleW00t/crane-installer/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/IAreKyleW00t/crane-installer/actions/workflows/codeql.yml/badge.svg)](https://github.com/IAreKyleW00t/crane-installer/actions/workflows/codeql.yml)  
[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-crane--installer-blue?style=flat&logo=github)](https://github.com/marketplace/actions/crane-installer)
[![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/IAreKyleW00t/crane-installer?style=flat&label=Latest%20Version&color=blue)](https://github.com/IAreKyleW00t/crane-installer/tags)
[![License](https://img.shields.io/github/license/IAreKyleW00t/crane-installer?label=License)](https://github.com/IAreKyleW00t/crane-installer/blob/main/LICENSE)
[![Dependabot](https://img.shields.io/badge/Dependabot-0366d6?style=flat&logo=dependabot&logoColor=white)](.github/dependabot.yml)

This Action downloads
[`crane`](https://github.com/google/go-containerregistry/tree/main/cmd/crane)
and adds it to your `PATH`, with optional signature verification if you use the
[SLSA Verifier](https://github.com/slsa-framework/slsa-verifier).

For a quick start guide on the usage of `crane`, refer to
[its documentation](https://github.com/google/go-containerregistry/blob/main/cmd/crane/recipes.md).

For available `crane` releases, refer to
[its releases](https://github.com/google/go-containerregistry/releases).

> This action supports Linux, macOS and Windows runners (results may vary with
> self-hosted runners).

## Quick Start

```yaml
- name: Install crane
  uses: iarekylew00t/crane-installer@v3
```

## Usage

> [!NOTE]
>
> `slsa-verifier` must be in your `PATH` for signature verification or it will
> be skipped - See
> [Automatic verification with SLSA Verifier](#automatic-verification-with-slsa-verifier).
> If `crane` is loaded from cache it will **not** be re-verified.

## Inputs

| Name            | Type    | Description                               | Default               |
| --------------- | ------- | ----------------------------------------- | --------------------- |
| `crane-release` | String  | `crane` release version to be installed   | `latest`              |
| `verify`        | Boolean | Perform signature verification on `crane` | `true`                |
| `cache`         | Boolean | Whether to utilize cache with `crane`     | `true`                |
| `token`         | String  | GitHub token for REST API access          | `${{ github.token }}` |

### Outputs

| Name        | Type    | Description                              |
| ----------- | ------- | ---------------------------------------- |
| `version`   | String  | The version of `crane` the was installed |
| `cache-hit` | Boolean | If `crane` was installed via cache       |

## Examples

### Pinned version

```yaml
- name: Install crane
  uses: iarekylew00t/crane-installer@v3
  with:
    crane-release: v0.20.2
```

### Authenticate using Action

```yaml
- name: Install crane
  uses: iarekylew00t/crane-installer@v3

- name: Login to DockerHub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}

- name: Login to GHCR
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ github.token }}
```

### Authenticate using `crane`

```yaml
- name: Install crane
  uses: iarekylew00t/crane-installer@v3

- name: Login to DockerHub
  run: |
    echo "${{ secrets.DOCKERHUB_TOKEN }}" | \
    crane auth login docker.io \
      --user "${{ vars.DOCKERHUB_USERNAME }}" \
      --pass-stdin

- name: Login to GHCR
  run: |
    echo "${{ github.token }}" | \
    crane auth login ghcr.io \
      --user "${{ github.actor }}" \
      --pass-stdin
```

### Automatic verification with SLSA Verifier

```yaml
- name: Install SLSA verifier
  uses: slsa-framework/slsa-verifier/actions/installer@v2.6.0

- name: Install crane
  uses: iarekylew00t/crane-installer@v3
```

## Development

> [!CAUTION]
>
> Since this is a TypeScript action you **must** transpile it into native
> JavaScript. This is done for you automatically as part of the `npm run all`
> command and will be validated via the
> [`check-dist.yml`](https://github.com/IAreKyleW00t/crane-installer/actions/workflows/check-dist.yml)
> Workflow in any PR.

1. ⚙️ Install the version of [Node.js](https://nodejs.org/en) as defined in the
   [`.node-version`](.node-version).  
   You can use [asdf](https://github.com/asdf-vm/asdf) to help manage your
   project runtimes.

   ```sh
   asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
   asdf install
   ```

2. 🛠️ Install dependencies

   ```sh
   npm install
   ```

3. 🏗️ Format, lint, test, and package your code changes.

   ```sh
   npm run all
   ```

## Releases

For maintainers, the following release process should be used when cutting new
versions.

1. ⏬ Ensure all changes are in the `main` branch and all necessary
   [Workflows](https://github.com/IAreKyleW00t/crane-installer/actions) are
   passing.

   ```sh
   git checkout main
   git pull
   ```

2. ✅ Ensure the [`package.json`](package.json#L4) and
   [`package-lock.json`](package-lock.json#L3) files are updated to with the new
   version being cut.

   ```sh
   npm update
   ```

3. 🔖 Create a new Tag, push it up, then create a
   [new Release](https://github.com/IAreKyleW00t/crane-installer/releases/new)
   for the version.

   ```sh
   git tag v1.2.3
   git push -u origin v1.2.3
   ```

   Alternatively you can create the Tag on the GitHub Release page itself.

   When the tag is pushed it will kick off the
   [Shared Tags](https://github.com/IAreKyleW00t/crane-installer/actions/workflows/shared-tags.yml)
   Workflows to update the `v$MAJOR` and `v$MAJOR.MINOR` tags.

## Contributing

Feel free to contribute and make things better by opening an
[Issue](https://github.com/IAreKyleW00t/crane-installer/issues) or
[Pull Request](https://github.com/IAreKyleW00t/crane-installer/pulls).  
Thank you for your contribution! ❤️

## License

See
[LICENSE](https://github.com/IAreKyleW00t/crane-installer/blob/main/LICENSE).
