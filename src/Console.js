// @flow
import type { Eff } from './Eff'
import { inj } from './Eff'

export class CONSOLE {}

export function log(message: string): Eff<{ console: CONSOLE }, void> {
  return inj(() => console.log(message)) // eslint-disable-line no-console
}

export function warn(message: string): Eff<{ console: CONSOLE }, void> {
  return inj(() => console.warn(message)) // eslint-disable-line no-console
}

export function error(message: string): Eff<{ console: CONSOLE }, void> {
  return inj(() => console.error(message)) // eslint-disable-line no-console
}

export function info(message: string): Eff<{ console: CONSOLE }, void> {
  return inj(() => console.info(message)) // eslint-disable-line no-console
}
