---
name: terraform-setup
description: Initialize Terraform infrastructure with AWS modules. Use when setting up cloud infrastructure, S3, EC2, or CloudFront.
---

# Terraform Infrastructure Setup Skill

Use this skill when setting up or modifying AWS infrastructure for the OpenCrochet application.

## Trigger
- Initial infrastructure setup
- New environment creation (dev/staging/prod)
- Adding new AWS resources
- Modifying existing infrastructure
- Disaster recovery setup

## Actions

### 1. Initialize Terraform Project
```bash
cd terraform
terraform init
```

### 2. Create Backend Configuration
Create `backend.tf`:
```hcl
terraform {
  backend "s3" {
    bucket         = "opencrochet-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "opencrochet-terraform-locks"
  }
}
```

### 3. Create S3 Module
Create `modules/s3/main.tf`:
```hcl
resource "aws_s3_bucket" "uploads" {
  bucket = "${var.project_name}-${var.environment}-uploads"
}

resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  rule {
    id     = "delete-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

resource "aws_s3_bucket_cors_rule" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = [var.allowed_origins]
    max_age_seconds = 3000
  }
}
```

Create `modules/s3/variables.tf`:
```hcl
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "opencrochet"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "allowed_origins" {
  description = "Allowed CORS origins"
  type        = string
}
```

Create `modules/s3/outputs.tf`:
```hcl
output "bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.uploads.id
}

output "bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.uploads.arn
}
```

### 4. Create EC2 Module
Create `modules/ec2/main.tf`:
```hcl
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "app" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type

  vpc_security_group_ids = [aws_security_group.app.id]

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y docker
              service docker start
              usermod -a -G docker ec2-user
              EOF

  tags = {
    Name        = "${var.project_name}-${var.environment}"
    Environment = var.environment
  }
}

resource "aws_security_group" "app" {
  name_prefix = "${var.project_name}-"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

Create `modules/ec2/variables.tf`:
```hcl
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "opencrochet"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed for SSH"
  type        = string
  default     = "0.0.0.0/0"
}
```

### 5. Create CloudFront Module
Create `modules/cloudfront/main.tf`:
```hcl
resource "aws_cloudfront_distribution" "cdn" {
  enabled = true

  origin {
    domain_name = var.origin_domain
    origin_id   = "app-origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "app-origin"

    forwarded_values {
      query_string = true
      headers      = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}"
    Environment = var.environment
  }
}
```

Create `modules/cloudfront/variables.tf`:
```hcl
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "opencrochet"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "origin_domain" {
  description = "Origin domain for CloudFront"
  type        = string
}
```

### 6. Create Main Configuration
Create `main.tf`:
```hcl
provider "aws" {
  region = var.aws_region
}

module "s3" {
  source = "./modules/s3"

  project_name    = var.project_name
  environment     = var.environment
  allowed_origins = var.allowed_origins
}

module "ec2" {
  source = "./modules/ec2"

  project_name     = var.project_name
  environment      = var.environment
  instance_type    = var.instance_type
  allowed_ssh_cidr = var.allowed_ssh_cidr
}

module "cloudfront" {
  source = "./modules/cloudfront"

  project_name  = var.project_name
  environment   = var.environment
  origin_domain = module.ec2.public_ip
}
```

Create `variables.tf`:
```hcl
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "opencrochet"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "allowed_origins" {
  description = "Allowed CORS origins"
  type        = string
  default     = "*"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed for SSH"
  type        = string
  default     = "0.0.0.0/0"
}
```

Create `outputs.tf`:
```hcl
output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = module.s3.bucket_name
}

output "ec2_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = module.ec2.public_ip
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain"
  value       = module.cloudfront.domain_name
}
```

### 7. Create Environment Variables
Create `dev.tfvars`:
```hcl
environment   = "dev"
instance_type = "t3.micro"
```

Create `prod.tfvars`:
```hcl
environment   = "prod"
instance_type = "t3.medium"
```

## Requirements
- MUST use modules for reusable components
- MUST store state remotely with locking (S3 + DynamoDB)
- MUST use variables for all configurable values
- MUST document all resources and dependencies
- MUST use environment-specific variable files
- MUST never commit secrets
- MUST implement least privilege IAM roles

## Commands
```bash
# Initialize
terraform init

# Plan
terraform plan -var-file="dev.tfvars"

# Apply
terraform apply -var-file="dev.tfvars"

# Destroy
terraform destroy -var-file="dev.tfvars"

# Format
terraform fmt

# Validate
terraform validate
```

## Security Checklist
- [ ] S3 bucket encryption enabled
- [ ] S3 bucket public access blocked
- [ ] EC2 security groups restricted
- [ ] No hardcoded secrets
- [ ] IAM roles with least privilege
- [ ] CloudFront HTTPS enforced
- [ ] State file encryption enabled
- [ ] DynamoDB locking enabled

## Cost Optimization
- Use t3.micro for dev, t3.medium for prod
- Enable S3 lifecycle policies
- Use CloudFront caching
- Monitor with AWS Cost Explorer
- Set up billing alerts

## Documentation
- Update docs/architecture.md when infrastructure changes
- Document all environment variables
- Include architecture diagrams (Mermaid)
- Maintain runbook for common operations
