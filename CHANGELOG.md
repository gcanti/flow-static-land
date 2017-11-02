# Changelog

> **Tags:**
> - [New Feature]
> - [Bug Fix]
> - [Breaking Change]
> - [Documentation]
> - [Internal]
> - [Polish]
> - [Experimental]

**Note**: Gaps between patch versions are faulty/broken releases.
**Note**: A feature tagged as Experimental is in a high state of flux, you're at risk of it changing without notice.

## 0.2.8

- **Bug Fix**
  - fix order of type parameters `Fun.compose` (@mozisan)

## 0.2.7

- **Bug Fix**
  - Fix error due to increase in strictness of arity checking as of Flow v0.47.0 (@hallettj)

## 0.2.6

- **Bug fix**
  - fix `ChainRec` definition [@gcanti]
  - fix `State` definition [@gcanti]

## 0.2.5

- **New Feature**
  - add optics (Monocle partial porting) (@gcanti)
- **Bug fix**
  - bad import references on in /lib build, fix #52 [@gcanti]

## 0.2.4

- **New Feature**
  - IO monad (@gcanti)
  - upgrade to flow v0.36, fix #45 (@gcanti)
  - add MonadError (@gcanti)
  - add Const (@gcanti)
- **Polish**
  - remove experimental React file (@gcanti)
  - cache projection in `Arr.ap` (@gcanti)
  - fix errors when experimental.const_params=true (@gcanti)
  - ignore lib folder while flow-checking (@gcanti)

## 0.2.3

- **New Feature**
  - `Foldable`: add default `foldMap` implementation (@gcanti)
  - `ChainRec` (@gcanti)
  - `Yoneda` (@gcanti)

## 0.2.2

- **New Feature**
  - add `Pointed` and `Copointed` type classes, fix #15 (@gcanti)
  - expose `concat` APIs, fix #33 (@gcanti)

## 0.2.1

- **New Feature**
  - increase the type arity of `compose` and `pipe` (@mwalkerwells)

## 0.2.0

- **Breaking Change**
  - `Traversable` now based on `traverse` instead of `sequence`, fix #26 (@gcanti)
- **New Feature**
  - `Task` (@gcanti)

## 0.1.0

Initial release
