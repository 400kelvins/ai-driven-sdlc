import { test } from 'node:test'
import assert from 'node:assert/strict'
import { badEmails, findSecrets } from '../../scripts/check-public.mjs'

test('only the noreply address is allowed', () => {
  assert.deepEqual(badEmails('190785603+400kelvins@users.noreply.github.com\n'), [])
  assert.deepEqual(badEmails('190785603+400kelvins@users.noreply.github.com\nsomeone@gmail.com\n'), ['someone@gmail.com'])
})

test('token patterns are caught', () => {
  assert.equal(findSecrets('+const t = "ghp_' + 'a'.repeat(36) + '"').length, 1)
  // Built at runtime so this file never contains a literal key header
  assert.equal(findSecrets('+' + '-'.repeat(5) + 'BEGIN OPENSSH PRIVATE' + ' KEY' + '-'.repeat(5)).length, 1)
  assert.deepEqual(findSecrets('+const tokens = 250000'), [])
})
