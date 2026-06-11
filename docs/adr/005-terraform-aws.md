# ADR 005: Use Terraform for AWS Infrastructure

## Status

Accepted

## Context

We needed infrastructure as code for AWS deployment. We evaluated:

1. **AWS Console (manual)** — Fast for one-off but not reproducible or version-controlled.
2. **AWS CloudFormation** — Native but verbose JSON/YAML.
3. **Terraform** — Multi-cloud, HCL is readable, state management, great modules.

## Decision

We chose **Terraform** because:

- **Multi-cloud**: Not locked to AWS; can extend to GCP/Azure later.
- **State management**: Remote state via S3 with locking via DynamoDB.
- **Modules**: Reusable infrastructure components (S3, EC2, CloudFront).
- **Plan/Apply workflow**: Review changes before applying them.
- **Community**: Huge ecosystem of modules and providers.

## Consequences

- Team must learn HCL (HashiCorp Configuration Language).
- State file must be secured (stored in S3 with encryption).
- Terraform version must be pinned (declared in `versions.tf`).
- CI/CD pipelines run `terraform plan` and `terraform apply`.

## References

- [Terraform documentation](https://www.terraform.io/)
- [AWS Provider documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
