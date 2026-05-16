# Security Policy

## Supported Versions

Only the latest version on `main` receives security fixes.

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please report vulnerabilities via email to **didi.barfoo@gmail.com** with the subject line `[allergy-tracker] Security Vulnerability`.

Include:

- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept
- Any suggested mitigations you have identified

You can expect an acknowledgement within 72 hours and a status update within 7 days.

## Scope

This project is designed to be self-hosted on a private network. The following are considered in-scope:

- Authentication or authorization bypasses that expose another user's data
- SQL injection or other injection vulnerabilities
- Vulnerabilities in the API routes that allow data exfiltration or corruption

Out of scope:

- Issues requiring physical access to the host machine
- Attacks requiring the attacker to already have database credentials
- Denial-of-service attacks against a private self-hosted instance
