# crane-installer GitHub Action

[![Docker Hub](https://img.shields.io/badge/marketplace-iarekylew00t%2Fcrane--installer-blue?style=flat)](https://hub.docker.com/r/iarekylew00t/crane-installer)
![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/IAreKyleW00t/crane-installer?label=version)
[![License](https://img.shields.io/github/license/IAreKyleW00t/crane-installer)](https://github.com/IAreKyleW00t/crane-installer/blob/main/LICENSE)

This GitHub Action enables you to interacting with remote images and registries using [`crane`](https://github.com/google/go-containerregistry/tree/main/cmd/crane). This action will verify the integrity of the `crane` release during installation using [SLSA 3 provenance](https://slsa.dev/) (see notes in [Usage](#usage)).

For a quick start guide on the usage of `crane`, please refer to https://github.com/google/go-containerregistry/blob/main/cmd/crane/recipes.md. For available crane releases, see https://github.com/google/go-containerregistry/releases.

---

- [Tags](#tags)
- [Usage](#usage)
- [Inputs](#inputs)
- [Examples](#examples)
  - [Pinned version](#pinned-version)
  - [Default version](#pinned-version)
  - [Authenicate on other registries](#authenticate-on-other-registries)

## Tags

The following tags are available for the `iarekylew00t/crane-installer` action.

- `main`
- `<version>` (eg: `v1.0.1`, including: `v1.0`, `v1`, etc.)

## Usage

This action currently supports GitHub-provided Linux, macOS and Windows runners (self-hosted runners may not work). MacOS and Windows runners do not work with the [slsa-verifier](https://github.com/slsa-framework/slsa-verifier/tree/main/actions/installer) action, so integrity validation is skipped for those.

Add the following entry to your Github workflow YAML file:

```yaml
uses: iarekylew00t/crane-installer@v1
with:
  crane-release: v0.14.0 # optional
```

## Inputs

| input           | Description                             | Default               |
| --------------- | --------------------------------------- | --------------------- |
| `crane-release` | `crane` release version to be installed | `latest`              |
| `install-dir`   | directory to install `crane` binary     | `$HOME/.crane`        |
| `token`         | token to use for GitHub authentication  | `${{ github.token }}` |

## Examples

### Pinned version

```yaml
jobs:
  crane:
    runs-on: ubuntu-latest
    steps:
      - name: Install crane
        uses: iarekylew00t/crane-installer@v1
        with:
          crane-release: v0.14.0
      - name: Check install
        run: crane version
```

### Default version

```yaml
jobs:
  crane:
    runs-on: ubuntu-latest
    steps:
      - name: Install crane
        uses: iarekylew00t/crane-installer@v1
      - name: Check install
        run: crane version
```

### Authenticate on other registries

```yaml
jobs:
  crane:
    runs-on: ubuntu-latest
    steps:
      - uses: iarekylew00t/crane-installer@v1
      - name: Login to Docker Hub
        run: |
          echo "${{ secrets.DOCKERHUB_TOKEN }} | \
          crane auth login docker.io \
            --username ${{ vars.DOCKERHUB_USERNAME }} \
            --password-stdin
```

## Contributing

Feel free to contribute and make things better by opening an [Issue](https://github.com/IAreKyleW00t/crane-installer/issues) or [Pull Request](https://github.com/IAreKyleW00t/crane-installer/pulls).

## License

See [LICENSE](https://github.com/IAreKyleW00t/crane-installer/blob/main/LICENSE).
