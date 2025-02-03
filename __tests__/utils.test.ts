import * as utils from '../src/utils'

describe('utils', () => {
  describe('getArch', () => {
    test.each([
      ['x64', 'x86_64'],
      ['arm64', 'arm64'],
      ['ppc64', 'ppc64le'],
      ['s390x', 's390x'],
      ['arm', 'armv6']
    ])('works for %s', (arch, expected) => {
      const result = utils.getArch(arch)
      expect(result).toEqual(expected)
    })

    test.each(['ia32', 'loong64', 'mips', 'mipsel', 'ppc', 'riscv64', 's390'])(
      'errors on %s',
      (arch) => {
        const result = (): string => utils.getArch(arch)
        expect(result).toThrow(`Unsupported architecture ${arch}`)
      }
    )
  })

  describe('getOS', () => {
    test.each([
      ['win32', 'Windows'],
      ['linux', 'Linux'],
      ['darwin', 'Darwin']
    ])('works for %s', (platform, expected) => {
      const result = utils.getOS(platform)
      expect(result).toEqual(expected)
    })

    test.each(['aix', 'freebsd', 'openbsd', 'sunos'])(
      'errors on %s',
      (platform) => {
        const result = (): string => utils.getOS(platform)
        expect(result).toThrow(`Unsupported OS ${platform}`)
      }
    )
  })

  describe('validVersion', () => {
    test.each(['v0.0.0', 'v1.0.0'])('accepts %s', (version) => {
      const result = utils.validVersion(version)
      expect(result).toBeTruthy()
    })

    test.each([
      'latest',
      'foobar',
      '1.0.0',
      '57755b13f9c806ec4281bdb148fc6c6ed2d08726'
    ])('rejects %s', (version) => {
      const result = utils.validVersion(version)
      expect(result).toBeFalsy()
    })
  })

  describe('isSha', () => {
    test('accepts 57755b13f9c806ec4281bdb148fc6c6ed2d08726', () => {
      const sha = '57755b13f9c806ec4281bdb148fc6c6ed2d08726'
      const result = utils.isSha(sha)
      expect(result).toBeTruthy()
    })

    test.each(['foobar', '1.0.0', '1', '1.0', '57755b1'])(
      'rejects %s',
      (sha) => {
        const result = utils.isSha(sha)
        expect(result).toBeFalsy()
      }
    )
  })
})
