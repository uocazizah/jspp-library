# jspp-library

**JavaScript++ Library** (jspp-library) is an experimental(on public preview) utility library that brings more features into the JavaScript ecosystem while embracing modern ECMAScript and TypeScript features.

The project focuses on providing lightweight, modular, and efficient utilities without re-writing them from scratch or without sacrificing JavaScript compatibility.

### Philosophy

- Keep APIs simple.
- Prefer readability.
- Avoid unnecessary dependencies.
- Avoid hell dependencies.
- Small.
- Lightweight.

### Compatibility

This project follows a compatibility-first development model. Maintaining long-term stability across multiple Node.js releases is one of the primary goals of this package. New releases are carefully designed to preserve existing behaviour whenever technically feasible while continuing to deliver security updates, bug fixes, and performance improvements.

Unlike many npm packages that only support the latest Active LTS releases, this package also aims to remain compatible with older Node.js versions whenever practical. Compatibility work is continuously evaluated based on runtime limitations, maintenance cost, and available APIs.


Release Schedule

A new **major version** is planned approximately every **6 months**.

Although version numbers follow Semantic Versioning (SemVer), major releases are **not intended to introduce unnecessary breaking changes**. Instead, major versions primarily serve as milestones for:

- Long-term maintenance planning.
- Security improvements.
- Internal refactoring.
- Performance optimisations.
- Compatibility updates for current and legacy Node.js releases.
- Deprecation of obsolete internal implementations when required.

Whenever a breaking change becomes unavoidable, it will be clearly documented in the release notes together with migration guidance.


Long-Term Support (LTS)

After each new major release becomes stable, the previous major version enters the **Long-Term Support (LTS)** phase.

During LTS, only maintenance updates are provided, including:

- Security patches.
- Critical bug fixes.
- Compatibility fixes.
- Documentation corrections.

No new features are added to LTS releases in order to maximise production stability.

You may choose either of the following approaches:

1. Remain on the latest LTS release for maximum stability.
2. Upgrade to the newest major version to receive new features and ongoing improvements.

Extended Maintenance

Projects running older versions are not immediately abandoned after the official LTS period ends.

Extended maintenance may be available upon request by contacting the package maintainer (see the **Author** section).

Depending on feasibility, the following may be provided:

- Security patches.
- Critical bug fixes.
- Compatibility fixes for supported Node.js environments.

The following are **not** included in extended maintenance:

- New features.
- API redesigns.
- Behavioural changes.
- Performance enhancements unrelated to security or correctness.

Feature development always targets the latest stable major release.


**Package**
| Version  | Status           | Release Date |
|----------|------------------|--------------|
| 1.x.x    | Current          | Jul 25, 2026 |

**Node.js that Support our package**
| Node.js  | Status           |
|----------|------------------|
| 26.x     | Supported        |
| 25.x     | Supported        |
| 24.x     | Supported        |
| 23.x     | Supported        |
| 22.x     | Supported        |
| 21.x     | Supported        |
| 20.x     | Supported        |
| 19.x     | Supported        |
| 18.x     | Supported        |
| 17.x     | Supported        |
| 16.x     | Work In Progress |
| 15.x     | Planning         |
| 14.x     | Planning         |


Versioning

Version numbers follow Semantic Versioning (SemVer) with a compatibility-focused interpretation.

- Patch releases (`x.y.Z`)
  - Bug fixes.
  - Security fixes.
  - Documentation updates.

- Minor releases (`x.Y.z`)
  - New backwards-compatible features.
  - Performance improvements.
  - Additional APIs.

- Major releases (`X.y.z`)
  - Long-term maintenance milestone.
  - Internal architectural improvements.
  - Security baseline updates.
  - Compatibility refresh across supported Node.js versions.
  - Breaking changes only when absolutely necessary.

### Documentation

Please go to [docs/](https://github.com/uocazizah/jspp-library) directory in our repository!

### Contributing

(for now) Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

Please ensure all tests pass before submitting changes.

### Author

Developed and maintained by Uoc Azizah <uoctamika.codeberg.org@gmail.com>.

under MIT <2026 copyright (C) Uoc Azizah>
