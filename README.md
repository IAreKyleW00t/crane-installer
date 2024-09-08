# 📦 crane-installer

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-crane--installer-blue?style=flat&logo=github)](https://github.com/marketplace/actions/crane-installer)
[![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/IAreKyleW00t/crane-installer?style=flat&label=Latest%20Version&color=blue)](https://github.com/IAreKyleW00t/crane-installer/tags)
[![Action Tests](https://github.com/IAreKyleW00t/crane-installer/actions/workflows/test.yml/badge.svg)](https://github.com/IAreKyleW00t/crane-installer/actions/workflows/test.yml)
[![License](https://img.shields.io/github/license/IAreKyleW00t/crane-installer?label=License)](https://github.com/IAreKyleW00t/crane-installer/blob/main/LICENSE)
[![Dependabot](https://img.shields.io/badge/Dependabot-0366d6?style=flat&logo=dependabot&logoColor=white)](.github/dependabot.yml)

This GitHub Action enables you to interacting with remote images and registries
using
[`crane`](https://github.com/google/go-containerregistry/tree/main/cmd/crane).
This action will verify the integrity of the `crane` release during installation
if you setup [SLSA 3 provenance](https://slsa.dev/) (see [Examples](#examples)
below). This Action will also utilize
[actions/cache](https://github.com/actions/cache) to cache the `crane` binary.

For a quick start guide on the usage of `crane`, please refer to
https://github.com/google/go-containerregistry/blob/main/cmd/crane/recipes.md.
For available crane releases, see
https://github.com/google/go-containerregistry/releases.

This action supports Linux, macOS and Windows runners (results may vary with
self-hosted runners).

## Quick Start

```yaml
- name: Install crane
  uses: iarekylew00t/crane-installer@v2
```

## Usage

> [!IMPORTANT]
>
> You need to authenticate into registries using either the
> [docker/login-action](https://github.com/docker/login-action) Action or by
> manually configuring credentials in within `crane` itself. See the
> [Examples](#examples) section for details on how to do this.

## Inputs

| Name            | Type    | Description                                   | Default               |
| --------------- | ------- | --------------------------------------------- | --------------------- |
| `crane-release` | String  | `crane` release version to be installed       | `latest`              |
| `install-dir`   | String  | directory to install `crane` binary           | `$HOME/.crane`        |
| `cache`         | Boolean | Cache the `crane` binary                      | `true`                |
| `verify`        | Boolean | Perform SLSA validation on `crane` binary [1] | `true`                |
| `token`         | String  | token to use for GitHub authentication        | `${{ github.token }}` |

> 1. `slsa-verifier` must be in your `PATH` for validation to work. It will be
>    skipped if it's not present; See
>    [Automatic validation with SLSA](#automatic-validation-with-slsa). The
>    `verify` input is if you want explicitly _skip_ the verification step when
>    it _would_ run.

## Examples

### Pinned version

```yaml
- name: Install crane
  uses: iarekylew00t/crane-installer@v2
  with:
    crane-release: v0.14.0
```

### Authenticate using Docker credentials

```yaml
- name: Install crane
  uses: iarekylew00t/crane-installer@v2

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

### Authenticate using crane

```yaml
- name: Install crane
  uses: iarekylew00t/crane-installer@v2

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

### Automatic validation with SLSA

```yaml
- name: Install SLSA verifier
  uses: iarekylew00t/setup-slsa-verifier@v1

- name: Install crane
  uses: iarekylew00t/crane-installer@v2
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

2. 🔖 Create a new Tag, push it up, then create a
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
