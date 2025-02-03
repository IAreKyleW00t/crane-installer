import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'

import { GitHub } from '@actions/github/lib/utils.js'

import { CRANE_REPO } from './main.js'

export function getArch(arch: string): string {
  switch (arch) {
    case 'x64':
      return 'x86_64'
    case 'ppc64':
      return 'ppc64le'
    case 'arm':
      return 'armv6'
    case 's390x':
    case 'arm64':
      return arch
    default:
      throw Error(`Unsupported architecture ${arch}`)
  }
}

export function getOS(os: string): string {
  switch (os) {
    case 'win32':
      return 'Windows'
    case 'linux':
    case 'darwin':
      return os.charAt(0).toUpperCase() + os.slice(1)
    default:
      throw Error(`Unsupported OS ${os}`)
  }
}

export function validVersion(version: string): boolean {
  const re = /^(v[0-9]+\.[0-9]+\.[0-9]+)$/
  if (re.test(version)) {
    return true
  } else {
    return false
  }
}

export function isSha(sha: string): boolean {
  const re = /^[a-f\d]{40}$/
  if (re.test(sha)) {
    return true
  } else {
    return false
  }
}

export async function getLatestVersion(
  octokit: InstanceType<typeof GitHub>
): Promise<string> {
  try {
    return (
      await octokit.rest.repos.getLatestRelease({
        owner: 'google',
        repo: 'go-containerregistry'
      })
    ).data.tag_name
  } catch (error) {
    core.debug(error instanceof Error ? error.message : (error as string))
    throw Error('Could not find latest release')
  }
}

export async function getVersionRelease(
  version: string,
  octokit: InstanceType<typeof GitHub>
): Promise<string> {
  try {
    return (
      await octokit.rest.repos.getReleaseByTag({
        owner: 'google',
        repo: 'go-containerregistry',
        tag: version
      })
    ).data.tag_name
  } catch (error) {
    core.debug(error instanceof Error ? error.message : (error as string))
    throw Error(`Could not find release ${version}`)
  }
}

export async function getVersionReleaseBySha(
  sha: string,
  octokit: InstanceType<typeof GitHub>
): Promise<string> {
  // Use pagination to loop over tags in chunks
  for await (const page of octokit.paginate.iterator(
    octokit.rest.repos.listTags,
    { owner: 'google', repo: 'go-containerregistry' }
  )) {
    // Loop over tags in page
    for (const tag of page.data) {
      if (!validVersion(tag.name)) continue // Skip non semver tags
      core.debug(`${tag.name} => ${tag.commit.sha}`)
      if (tag.commit.sha === sha) {
        try {
          // Multiple tags can exist for the same commit so we should check
          // them until we get a valid match or exhausted all options
          return getVersionRelease(tag.name, octokit)
        } catch (error) {
          core.debug(error instanceof Error ? error.message : (error as string))
        }
      }
    }
  }
  throw Error(`Could not find tag or release associated with commit ${sha}`)
}

export async function downloadReleaseArtifact(
  version: string,
  artifact: string,
  output: string
): Promise<string> {
  try {
    return await tc.downloadTool(
      `${CRANE_REPO}/releases/download/${version}/${artifact}`,
      output
    )
  } catch (error) {
    core.debug(error instanceof Error ? error.message : (error as string))
    throw Error(`Failed to download artifact ${artifact} ${version}`)
  }
}
