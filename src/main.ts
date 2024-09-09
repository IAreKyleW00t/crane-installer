import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'
import * as tc from '@actions/tool-cache'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'

import { lookpath } from 'lookpath'
import * as utils from './utils'

export const CRANE_REPO = 'https://github.com/google/go-containerregistry'

export async function run(): Promise<void> {
  let tmpDir
  try {
    // System information
    const OS = utils.getOS(process.platform)
    const ARCH = utils.getArch(process.arch)
    const EXE = OS === 'Windows' ? '.exe' : ''
    const BIN_NAME = `crane${EXE}`
    const ARTIFACT_NAME = `go-containerregistry_${OS}_${ARCH}.tar.gz`

    // Authenticate with GitHub
    const octokit = github.getOctokit(core.getInput('token'))

    // Validate requested version
    let version = core.getInput('crane-release')
    try {
      core.debug(`version => ${version}`)
      if (utils.isSha(version)) {
        version = await utils.getVersionReleaseBySha(version, octokit)
      } else if (utils.validVersion(version)) {
        version = await utils.getVersionRelease(version, octokit)
      } else if (version === 'latest') {
        version = await utils.getLatestVersion(octokit)
      } else throw Error
    } catch (error) {
      // If we get an error message, then something when wrong with a valid
      // version. If we get a blank error, that means we got an invalid version.
      const message = error instanceof Error ? error.message : ''
      if (message) {
        throw Error(
          `${message} - For a list of valid versions, see ${CRANE_REPO}/releases`
        )
      } else {
        throw Error(
          `Invalid version ${version} - For a list of valid versions, see ${CRANE_REPO}/releases`
        )
      }
    }
    core.info(`🏗️ Setting up crane ${version}`)
    core.setOutput('version', version)

    // Create temp directory for downloading non-cached versions
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'crane_'))
    core.debug(`tmpdir => ${tmpDir}`)

    // Check if crane is already in the tool-cache
    const cache = core.getInput('cache')
    core.debug('Checking crane cache')
    let mainCachePath = tc.find('crane', version.substring(1))
    core.setOutput('cache-hit', cache && !!mainCachePath)
    if (!mainCachePath || !cache) {
      // Download release Tar into tmpDir
      core.info('⏬ Downloading crane release')
      const mainTar = await utils.downloadReleaseArtifact(
        version,
        ARTIFACT_NAME,
        path.join(tmpDir, ARTIFACT_NAME)
      )

      // Verify crane if slsa-verifier is in the PATH (unless told to skip)
      const slsa = await lookpath('slsa-verifier')
      if (core.getBooleanInput('verify') && slsa) {
        // Download release attestation into tmpDir
        core.info('🔏 Downloading attestation')
        const attestation = await utils.downloadReleaseArtifact(
          version,
          'multiple.intoto.jsonl',
          path.join(tmpDir, 'multiple.intoto.jsonl')
        )

        // Validate binary against downloaded signature
        // This will display stdout and stderr automatically
        core.info('🔍 Verifying signature')
        try {
          // This will exit 1 on error and display stdout and stderr automatically
          await exec.getExecOutput(slsa, [
            'verify-artifact',
            mainTar,
            '--provenance-path',
            attestation,
            '--source-uri',
            'github.com/google/go-containerregistry',
            '--source-tag',
            version
          ])
        } catch (error) {
          core.debug(error instanceof Error ? error.message : (error as string))
          throw Error('Signature verification failed')
        }
        core.info('✅ Signature verified')
      } else core.info('⏭️ Skipped signature verification')

      // Extract release Tar and get crane binary
      core.info('📤 Extracting crane release')
      const mainDir = await tc.extractTar(mainTar, tmpDir)
      const mainBin = path.join(mainDir, BIN_NAME)
      fs.chmodSync(mainBin, 0o755)

      // Cache the crane download
      mainCachePath = await tc.cacheFile(
        mainBin,
        BIN_NAME,
        'crane',
        version.substring(1) // remove leading 'v'
      )
    } else core.info('📥 Loaded from runner cache')

    // Add the cached crane to our PATH
    core.addPath(mainCachePath)
    core.info('🎉 crane is ready')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
    else core.setFailed(error as string)
  }

  // Cleanup tmpDir if it was created at any point
  if (tmpDir) {
    core.debug(`Deleting ${tmpDir}`)
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}
