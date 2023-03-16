# crane-installer GitHub Action

[![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/IAreKyleW00t/crane-installer?label=version)](https://github.com/IAreKyleW00t/crane-installer/tags)
[![License](https://img.shields.io/github/license/IAreKyleW00t/crane-installer)](https://github.com/IAreKyleW00t/crane-installer/blob/main/LICENSE)

This GitHub Action enables you to interacting with remote images and registries using [`crane`](https://github.com/google/go-containerregistry/tree/main/cmd/crane). This action will verify the integrity of the `crane` release during installation using [SLSA 3 provenance](https://slsa.dev/).

For a quick start guide on the usage of `crane`, please refer to https://github.com/google/go-containerregistry/blob/main/cmd/crane/recipes.md. For available crane releases, see https://github.com/google/go-containerregistry/releases.

---

- [Usage](#usage)
- [Inputs](#inputs)
- [Examples](#examples)
  - [Pinned version](#pinned-version)
  - [Default version](#pinned-version)

## Usage

This action currently supports GitHub-provided Linux runners (self-hosted runners may not work). MacOS and Windows runners currently have issues with the [slsa-verifier/actions/installer](https://github.com/slsa-framework/slsa-verifier/tree/main/actions/installer)

Add the following entry to your Github workflow YAML file:

```yaml
uses: iarekylew00t/crane-installer@v1
with:
  crane-release: v0.14.0 # optional
```

## Inputs

| input           | Description                             | Default        |
| --------------- | --------------------------------------- | -------------- |
| `crane-release` | `crane` release version to be installed | `latest`       |
| `install-dir`   | directory to install `crane` binary     | `$HOME/.crane` |

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
          crane-release: v0.14.0 # optional
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

## Contributing

Feel free to contribute and make things better by opening an [Issue](https://github.com/IAreKyleW00t/crane-installer/issues) or [Pull Request](https://github.com/IAreKyleW00t/crane-installer/pulls).

## License

See [LICENSE](https://github.com/IAreKyleW00t/crane-installer/blob/main/LICENSE).
