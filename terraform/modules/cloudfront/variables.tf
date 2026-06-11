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
